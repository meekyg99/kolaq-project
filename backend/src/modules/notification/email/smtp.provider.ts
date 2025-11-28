import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailProvider, EmailOptions, EmailResult } from './email-provider.interface';

@Injectable()
export class SmtpProvider implements IEmailProvider {
  private readonly logger = new Logger(SmtpProvider.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: port || 587,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false, // For development/Hostinger
        },
      });

      // Verify connection
      this.transporter.verify((error) => {
        if (error) {
          this.logger.error(`SMTP connection failed: ${error.message}`);
          this.transporter = null;
        } else {
          this.logger.log('SMTP email provider initialized (Hostinger)');
        }
      });
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }

  getProviderName(): string {
    return 'smtp';
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'SMTP not configured',
        provider: 'smtp',
      };
    }

    try {
      const fromEmail = options.from || 
        this.configService.get<string>('EMAIL_FROM', 'KOLAQ ALAGBO <support@kolaqalagbo.org>');

      const mailOptions: nodemailer.SendMailOptions = {
        from: fromEmail,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      };

      if (options.attachments) {
        mailOptions.attachments = options.attachments;
      }

      const result = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email sent via SMTP to ${options.to}`);
      
      return {
        success: true,
        messageId: result.messageId,
        provider: 'smtp',
      };
    } catch (error) {
      this.logger.error(`SMTP email failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        provider: 'smtp',
      };
    }
  }
}
