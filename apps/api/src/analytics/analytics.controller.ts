import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SessionGuard } from '../auth/auth.guard';
import { AnalyticsService, AnalyticsSummary } from './analytics.service';
import { AnalyticsVisitorService } from './analytics-visitor.service';

const ALLOWED_RANGES = [7, 30, 90];

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly analyticsVisitorService: AnalyticsVisitorService,
  ) {}

  @Post('consent')
  async consent(
    @Body() body: { policyVersion?: number },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true }> {
    if (typeof body.policyVersion !== 'number') {
      throw new BadRequestException('policyVersion is required');
    }
    const { visitorHash, isNew } = this.analyticsVisitorService.mintOnConsent(
      req,
      res,
    );
    if (isNew) {
      await this.analyticsService.recordConsent(
        visitorHash,
        body.policyVersion,
      );
    }
    return { ok: true };
  }

  @Post('pageview')
  async pageview(
    @Body() body: { path?: string; referrerHost?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.status(204);
    if (typeof body.path !== 'string' || !body.path) return;

    const visitorHash = this.analyticsVisitorService.identifyExisting(req);
    if (!visitorHash) return; // no consent cookie: hard backstop, never record

    await this.analyticsService.recordPageview(
      visitorHash,
      body.path,
      body.referrerHost,
      req.headers['user-agent'],
      req.ip,
    );
  }

  @Delete('me')
  async deleteMe(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true; deletedCount: number }> {
    const visitorHash = this.analyticsVisitorService.identifyExisting(req);
    this.analyticsVisitorService.clearCookie(res);
    if (!visitorHash) return { ok: true, deletedCount: 0 };

    const deletedCount =
      await this.analyticsService.deleteVisitorData(visitorHash);
    return { ok: true, deletedCount };
  }

  @Get('summary')
  @UseGuards(SessionGuard)
  async summary(@Query('range') range?: string): Promise<AnalyticsSummary> {
    const days = range ? Number(range) : 7;
    if (!ALLOWED_RANGES.includes(days)) {
      throw new BadRequestException('range must be 7, 30 or 90');
    }
    return this.analyticsService.getSummary(days);
  }
}
