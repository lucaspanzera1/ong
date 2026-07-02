import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { MailerService } from './mailer.service';
import { SessionGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [TokenService, MailerService, SessionGuard],
  exports: [TokenService, SessionGuard],
})
export class AuthModule {}
