import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.from = this.config.get<string>('MAIL_FROM', 'no-reply@koodisoft.com');
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(`[mail:dev] código para ${email}: ${code}`);
      return;
    }

    await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Tu código para restablecer tu contraseña',
      html: `<p>Tu código de verificación es <strong>${code}</strong>. Vence en 15 minutos.</p>`,
    });
  }
}
