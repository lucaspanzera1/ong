import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenService } from './token.service';

export interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookieName = this.config.getOrThrow<string>('AUTH_COOKIE_NAME');
    const token: unknown = request.cookies?.[cookieName];

    if (typeof token !== 'string' || !token) {
      throw new UnauthorizedException('No session cookie');
    }

    const email = await this.tokenService.verifySessionToken(token);
    request.user = { email };
    return true;
  }
}
