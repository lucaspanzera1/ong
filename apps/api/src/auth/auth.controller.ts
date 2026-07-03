import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { MailerService } from './mailer.service';
import { TokenService } from './token.service';
import { SessionGuard } from './auth.guard';
import type { AuthenticatedRequest } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(): Promise<{ message: string }> {
    const allowedEmail = this.config
      .getOrThrow<string>('AUTH_ALLOWED_EMAIL')
      .trim()
      .toLowerCase();

    const token = await this.tokenService.createLoginToken(allowedEmail);
    const apiPublicUrl = this.config.getOrThrow<string>('API_PUBLIC_URL');
    const link = `${apiPublicUrl}/auth/verify?token=${encodeURIComponent(token)}`;
    await this.mailerService.sendMagicLink(allowedEmail, link);

    return { message: 'Login link sent.' };
  }

  @Get('verify')
  async verify(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    const email = await this.tokenService.verifyLoginToken(token);
    const sessionToken = await this.tokenService.createSessionToken(email);

    const cookieName = this.config.getOrThrow<string>('AUTH_COOKIE_NAME');
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';

    res.cookie(cookieName, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: this.tokenService.sessionTtlMs,
      path: '/',
    });

    const appUrl = this.config.getOrThrow<string>('APP_URL');
    const redirectPath = this.config.getOrThrow<string>('AUTH_REDIRECT_PATH');
    res.redirect(302, `${appUrl}${redirectPath}`);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response): void {
    const cookieName = this.config.getOrThrow<string>('AUTH_COOKIE_NAME');
    res.clearCookie(cookieName, { path: '/' });
  }

  @Get('me')
  @UseGuards(SessionGuard)
  me(@Req() req: AuthenticatedRequest): { email: string } {
    return { email: req.user!.email };
  }
}
