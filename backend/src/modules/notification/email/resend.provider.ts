import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IEmailProvider, EmailOptions, EmailResult } from './email-provider.interface';

@Injectable()
export class ResendProvider implements IEmailProvider {
  private readonly logger = new Logger(ResendProvider.name);
  private resend: Resend | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend email provider initialized');
    }
  }

  isConfigured(): boolean {
    return this.resend !== null;
  }

  getProviderName(): string {
    return 'resend';
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    if (!this.resend) {
      return {
        success: false,
        error: 'Resend API not configured',
        provider: 'resend',
      };
    }

    try {
      const fromEmail = options.from || 
        this.configService.get<string>('EMAIL_FROM', 'KOLAQ ALAGBO <support@kolaqalagbo.org>');

      const result = await this.resend.emails.send({
        from: fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });

      this.logger.log(`Email sent via Resend to ${options.to}`);
      
      return {
        success: true,
        messageId: result.data?.id,
        provider: 'resend',
      };
    } catch (error) {
      this.logger.error(`Resend email failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        provider: 'resend',
      };
    }
  }
}
