import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(data: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const from = data.from || this.config.get('SUPPORT_EMAIL', 'support@kolaqbitters.com');
      
      const result = await this.resend.emails.send({
        from,
        to: Array.isArray(data.to) ? data.to : [data.to],
        subject: data.subject,
        html: data.html,
      });

      this.logger.log(`Email sent successfully: ${result.data?.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendOrderConfirmation(orderId: string, email: string) {
    return this.sendEmail({
      to: email,
      subject: 'Order Confirmation - Kolaq Bitters',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order #${orderId} has been received and is being processed.</p>
        <p>We'll send you another email when your order ships.</p>
      `,
    });
  }

  async sendLowStockAlert(productName: string, currentStock: number) {
    const adminEmail = this.config.get('ADMIN_EMAIL', 'admin@kolaqbitters.com');
    
    return this.sendEmail({
      to: adminEmail,
      subject: `Low Stock Alert: ${productName}`,
      html: `
        <h2>Low Stock Alert</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Current Stock:</strong> ${currentStock}</p>
        <p>Please restock this item soon.</p>
      `,
    });
  }

  async sendBroadcast(recipients: string[], subject: string, html: string) {
    const results = await Promise.allSettled(
      recipients.map(email => this.sendEmail({ to: email, subject, html }))
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    this.logger.log(`Broadcast complete: ${success} sent, ${failed} failed`);
    return { success, failed };
  }
}
