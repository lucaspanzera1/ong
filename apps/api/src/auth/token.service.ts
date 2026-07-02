import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptJWT, jwtDecrypt } from 'jose';

type TokenPurpose = 'login' | 'session';

interface TokenPayload {
  sub: string;
  purpose: TokenPurpose;
}

@Injectable()
export class TokenService {
  private readonly key: Uint8Array;
  private readonly magicLinkTtlSeconds: number;
  private readonly sessionTtlSeconds: number;

  constructor(private readonly config: ConfigService) {
    const secret = this.config.getOrThrow<string>('AUTH_JWE_SECRET');
    const key = Buffer.from(secret, 'base64');
    if (key.length !== 32) {
      throw new Error(
        'AUTH_JWE_SECRET must decode to exactly 32 bytes (base64). Generate one with: openssl rand -base64 32',
      );
    }
    this.key = key;
    this.magicLinkTtlSeconds = Number(this.config.getOrThrow<string>('AUTH_MAGIC_LINK_TTL_SECONDS'));
    this.sessionTtlSeconds = Number(this.config.getOrThrow<string>('AUTH_SESSION_TTL_SECONDS'));
  }

  async createLoginToken(email: string): Promise<string> {
    return this.encrypt({ sub: email, purpose: 'login' }, this.magicLinkTtlSeconds);
  }

  async verifyLoginToken(token: string): Promise<string> {
    return this.decrypt(token, 'login');
  }

  async createSessionToken(email: string): Promise<string> {
    return this.encrypt({ sub: email, purpose: 'session' }, this.sessionTtlSeconds);
  }

  async verifySessionToken(token: string): Promise<string> {
    return this.decrypt(token, 'session');
  }

  get sessionTtlMs(): number {
    return this.sessionTtlSeconds * 1000;
  }

  private async encrypt(payload: TokenPayload, ttlSeconds: number): Promise<string> {
    return new EncryptJWT({ ...payload })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + ttlSeconds)
      .encrypt(this.key);
  }

  private async decrypt(token: string, expectedPurpose: TokenPurpose): Promise<string> {
    try {
      const { payload } = await jwtDecrypt<TokenPayload>(token, this.key);
      if (payload.purpose !== expectedPurpose || typeof payload.sub !== 'string') {
        throw new Error('unexpected token purpose');
      }
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
