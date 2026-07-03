import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { hashWithSecret } from '../common/hash.util';

const COOKIE_NAME = 'ong_aid';
const COOKIE_MAX_AGE_MS = 396 * 24 * 60 * 60 * 1000; // ~13 months, matches PageView retention

export interface MintResult {
  visitorHash: string;
  isNew: boolean;
}

// Separate from articles/visitor.service.ts on purpose: that cookie is
// strictly necessary (vote/view anti-abuse) and doesn't need consent, while
// this one is general site analytics and legally requires opt-in consent
// under LGPD. Keeping the cookie, hash secret, and mint semantics apart
// keeps that distinction enforceable in code, not just in the cookie name.
@Injectable()
export class AnalyticsVisitorService {
  constructor(private readonly config: ConfigService) {}

  // Only ever called from the consent flow. Mints the cookie if absent;
  // no-ops (same hash returned) if the visitor already has one.
  mintOnConsent(req: Request, res: Response): MintResult {
    const existing: unknown = req.cookies?.[COOKIE_NAME];
    if (typeof existing === 'string' && existing) {
      return { visitorHash: this.hash(existing), isNew: false };
    }

    const visitorId = randomUUID();
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie(COOKIE_NAME, visitorId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
      path: '/',
    });
    return { visitorHash: this.hash(visitorId), isNew: true };
  }

  // Read-only: never sets a cookie. This is the hard backstop that keeps
  // pre-consent requests from ever being recorded.
  identifyExisting(req: Request): string | null {
    const existing: unknown = req.cookies?.[COOKIE_NAME];
    if (typeof existing !== 'string' || !existing) return null;
    return this.hash(existing);
  }

  clearCookie(res: Response): void {
    res.clearCookie(COOKIE_NAME, { path: '/' });
  }

  private hash(visitorId: string): string {
    const secret = this.config.getOrThrow<string>('ANALYTICS_HASH_SECRET');
    return hashWithSecret(visitorId, secret);
  }
}
