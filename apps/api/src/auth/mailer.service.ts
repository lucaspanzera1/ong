import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from = this.config.getOrThrow<string>('SMTP_FROM');
    this.transporter = createTransport({
      host: this.config.getOrThrow<string>('SMTP_HOST'),
      port: Number(this.config.getOrThrow<string>('SMTP_PORT')),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.getOrThrow<string>('SMTP_USER'),
        pass: this.config.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendMagicLink(to: string, link: string): Promise<void> {
    const ttlMinutes = Math.round(
      Number(this.config.getOrThrow<string>('AUTH_MAGIC_LINK_TTL_SECONDS')) / 60,
    );

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Seu link de acesso',
      text: `Clique no link abaixo para entrar. Ele expira em ${ttlMinutes} minutos.\n\n${link}`,
      html: `<p>Clique no link abaixo para entrar. Ele expira em ${ttlMinutes} minutos.</p><p><a href="${link}">${link}</a></p>`,
    });
  }
}
