import { createHash, randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

export interface VisitorIdentity {
  voterHash: string;
  ipHash: string;
}

@Injectable()
export class VisitorService {
  constructor(private readonly config: ConfigService) {}

  identify(req: Request, res: Response): VisitorIdentity {
    const cookieName = this.config.get<string>(
      'VISITOR_COOKIE_NAME',
      'ong_vid',
    );
    const secret = this.config.getOrThrow<string>('INTERACTION_HASH_SECRET');
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';

    let visitorId: unknown = req.cookies?.[cookieName];
    if (typeof visitorId !== 'string' || !visitorId) {
      visitorId = randomUUID();
      res.cookie(cookieName, visitorId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 365 * 24 * 60 * 60 * 1000,
        path: '/',
      });
    }

    const voterHash = this.hash(visitorId as string, secret);
    const ipHash = this.hash(this.normalizeIp(req.ip), secret);
    return { voterHash, ipHash };
  }

  private hash(value: string, secret: string): string {
    return createHash('sha256').update(`${secret}:${value}`).digest('hex');
  }

  private normalizeIp(ip: string | undefined): string {
    if (!ip) return 'unknown';
    return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  }
}
