import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { normalizeIp } from '../common/hash.util';
import {
  PageView,
  PageViewDevice,
  PageViewDocument,
} from './schemas/page-view.schema';
import { ConsentLog, ConsentLogDocument } from './schemas/consent-log.schema';

const MAX_PATH_LENGTH = 500;

export interface DailyPoint {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface AnalyticsSummary {
  range: number;
  totals: { visits: number; uniqueVisitors: number };
  daily: DailyPoint[];
  topPages: Array<{ path: string; visits: number }>;
  referrers: Array<{ referrerHost: string; visits: number }>;
  devices: Array<{ device: string; visits: number }>;
  browsers: Array<{ browser: string; visits: number }>;
  countries: Array<{ country: string; visits: number }>;
}

function sanitizePath(path: string): string {
  const withoutQuery = path.split('?')[0].split('#')[0];
  return withoutQuery.slice(0, MAX_PATH_LENGTH) || '/';
}

function detectDevice(userAgent: string | undefined): PageViewDevice {
  if (!userAgent) return 'desktop';
  const { device } = new UAParser(userAgent).getResult();
  if (device.type === 'mobile') return 'mobile';
  if (device.type === 'tablet') return 'tablet';
  return 'desktop';
}

function detectBrowser(userAgent: string | undefined): string | undefined {
  if (!userAgent) return undefined;
  const { browser } = new UAParser(userAgent).getResult();
  return browser.name || undefined;
}

function detectCountry(ip: string | undefined): string | undefined {
  const lookup = geoip.lookup(normalizeIp(ip));
  return lookup?.country || undefined;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(PageView.name)
    private readonly pageViewModel: Model<PageViewDocument>,
    @InjectModel(ConsentLog.name)
    private readonly consentLogModel: Model<ConsentLogDocument>,
  ) {}

  async recordConsent(
    visitorHash: string,
    policyVersion: number,
  ): Promise<void> {
    await this.consentLogModel.create({ visitorHash, policyVersion });
  }

  async recordPageview(
    visitorHash: string,
    path: string,
    referrerHost: string | undefined,
    userAgent: string | undefined,
    ip: string | undefined,
  ): Promise<void> {
    await this.pageViewModel.create({
      visitorHash,
      path: sanitizePath(path),
      referrerHost: referrerHost?.slice(0, 255) || undefined,
      device: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      country: detectCountry(ip),
    });
  }

  async deleteVisitorData(visitorHash: string): Promise<number> {
    const result = await this.pageViewModel.deleteMany({ visitorHash }).exec();
    return result.deletedCount ?? 0;
  }

  async getSummary(days: number): Promise<AnalyticsSummary> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const match = { createdAt: { $gte: since } };

    const [totals, daily, topPages, referrers, devices, browsers, countries] =
      await Promise.all([
        this.pageViewModel
          .aggregate<{ visits: number; uniqueVisitors: number }>([
            { $match: match },
            {
              $group: {
                _id: null,
                visits: { $sum: 1 },
                visitors: { $addToSet: '$visitorHash' },
              },
            },
            {
              $project: {
                _id: 0,
                visits: 1,
                uniqueVisitors: { $size: '$visitors' },
              },
            },
          ])
          .exec(),
        this.pageViewModel
          .aggregate<DailyPoint>([
            { $match: match },
            {
              $group: {
                _id: {
                  day: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$createdAt',
                      timezone: 'America/Sao_Paulo',
                    },
                  },
                  visitorHash: '$visitorHash',
                },
                visits: { $sum: 1 },
              },
            },
            {
              $group: {
                _id: '$_id.day',
                visits: { $sum: '$visits' },
                uniqueVisitors: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: { _id: 0, date: '$_id', visits: 1, uniqueVisitors: 1 },
            },
          ])
          .exec(),
        this.pageViewModel
          .aggregate<{ path: string; visits: number }>([
            { $match: match },
            { $group: { _id: '$path', visits: { $sum: 1 } } },
            { $sort: { visits: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, path: '$_id', visits: 1 } },
          ])
          .exec(),
        this.pageViewModel
          .aggregate<{ referrerHost: string; visits: number }>([
            { $match: match },
            {
              $group: {
                _id: { $ifNull: ['$referrerHost', 'direto'] },
                visits: { $sum: 1 },
              },
            },
            { $sort: { visits: -1 } },
            { $limit: 15 },
            { $project: { _id: 0, referrerHost: '$_id', visits: 1 } },
          ])
          .exec(),
        this.pageViewModel
          .aggregate<{ device: string; visits: number }>([
            { $match: match },
            { $group: { _id: '$device', visits: { $sum: 1 } } },
            { $project: { _id: 0, device: '$_id', visits: 1 } },
          ])
          .exec(),
        this.pageViewModel
          .aggregate<{ browser: string; visits: number }>([
            { $match: match },
            {
              $group: {
                _id: { $ifNull: ['$browser', 'Outro'] },
                visits: { $sum: 1 },
              },
            },
            { $sort: { visits: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, browser: '$_id', visits: 1 } },
          ])
          .exec(),
        this.pageViewModel
          .aggregate<{ country: string; visits: number }>([
            { $match: match },
            {
              $group: {
                _id: { $ifNull: ['$country', 'desconhecido'] },
                visits: { $sum: 1 },
              },
            },
            { $sort: { visits: -1 } },
            { $limit: 20 },
            { $project: { _id: 0, country: '$_id', visits: 1 } },
          ])
          .exec(),
      ]);

    return {
      range: days,
      totals: totals[0] ?? { visits: 0, uniqueVisitors: 0 },
      daily,
      topPages,
      referrers,
      devices,
      browsers,
      countries,
    };
  }
}
