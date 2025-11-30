import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailProvider, EmailOptions, EmailResult } from './email-provider.interface';
import { ResendProvider } from './resend.provider';
import { SmtpProvider } from './smtp.provider';

export type EmailProviderType = 'resend' | 'smtp' | 'auto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private primaryProvider: IEmailProvider | null = null;
  private fallbackProvider: IEmailProvider | null = null;

  constructor(
    private configService: ConfigService,
    private resendProvider: ResendProvider,
    private smtpProvider: SmtpProvider,
  ) {
    this.initializeProviders();
  }

  private initializeProviders() {
    const preferredProvider = this.configService.get<EmailProviderType>('EMAIL_PROVIDER', 'auto');

    if (preferredProvider === 'smtp') {
      this.primaryProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
      this.fallbackProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
    } else if (preferredProvider === 'resend') {
      this.primaryProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
      this.fallbackProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
    } else {
      // Auto mode: prefer Resend (more reliable), fallback to SMTP
      if (this.resendProvider.isConfigured()) {
        this.primaryProvider = this.resendProvider;
        this.fallbackProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
      } else if (this.smtpProvider.isConfigured()) {
        this.primaryProvider = this.smtpProvider;
        this.fallbackProvider = null;
      }
    }

    if (this.primaryProvider) {
      this.logger.log(`Primary email provider: ${this.primaryProvider.getProviderName()}`);
    }
    if (this.fallbackProvider) {
      this.logger.log(`Fallback email provider: ${this.fallbackProvider.getProviderName()}`);
    }
    if (!this.primaryProvider) {
      this.logger.warn('No email provider configured! Emails will not be sent.');
    }
  }

  isConfigured(): boolean {
    return this.primaryProvider !== null;
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    if (!this.primaryProvider) {
      this.logger.warn('No email provider available, email not sent');
      return {
        success: false,
        error: 'No email provider configured',
        provider: 'resend',
      };
    }

    // Try primary provider first
    let result = await this.primaryProvider.send(options);

    // If failed and we have a fallback, try it
    if (!result.success && this.fallbackProvider) {
      this.logger.warn(`Primary provider failed, trying fallback: ${this.fallbackProvider.getProviderName()}`);
      result = await this.fallbackProvider.send(options);
    }

    return result;
  }

  // Convenience methods for common email types
  async sendWelcomeEmail(to: string, customerName: string): Promise<EmailResult> {
    const { welcomeEmailTemplate } = await import('../templates/welcome.template');
    return this.send({
      to,
      subject: 'Welcome to KOLAQ ALAGBO! 🌿',
      html: welcomeEmailTemplate({ customerName }),
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string, customerName: string): Promise<EmailResult> {
    const { passwordResetTemplate } = await import('../templates/password-reset.template');
    const resetUrl = `${this.configService.get('FRONTEND_URL', 'https://kolaqalagbo.org')}/reset-password?token=${resetToken}`;
    return this.send({
      to,
      subject: 'Reset Your Password - KOLAQ ALAGBO',
      html: passwordResetTemplate({ customerName, resetUrl }),
    });
  }

  async sendOrderConfirmation(to: string, orderData: {
    customerName: string;
    orderNumber: string;
    items: Array<{ name: string; quantity: number; price: number; size?: string }>;
    subtotal: number;
    shippingCost: number;
    total: number;
    currency: string;
    shippingAddress: string;
    estimatedDelivery?: string;
  }): Promise<EmailResult> {
    const { orderConfirmationTemplate } = await import('../templates/order-confirmation.template');
    return this.send({
      to,
      subject: `Order Confirmed! #${orderData.orderNumber} 🎉`,
      html: orderConfirmationTemplate(orderData),
    });
  }

  async sendOrderProcessing(to: string, orderData: {
    customerName: string;
    orderNumber: string;
    message?: string;
  }): Promise<EmailResult> {
    const { orderProcessingTemplate } = await import('../templates/order-processing.template');
    return this.send({
      to,
      subject: `Your Order #${orderData.orderNumber} is Being Processed 📦`,
      html: orderProcessingTemplate(orderData),
    });
  }

  async sendOrderShipped(to: string, orderData: {
    customerName: string;
    orderNumber: string;
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    estimatedDelivery?: string;
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      country: string;
    };
  }): Promise<EmailResult> {
    const { orderShippedTemplate } = await import('../templates/order-shipped.template');
    return this.send({
      to,
      subject: `Your Order #${orderData.orderNumber} Has Shipped! 🚚`,
      html: orderShippedTemplate(orderData),
    });
  }

  async sendOrderDelivered(to: string, orderData: {
    customerName: string;
    orderNumber: string;
  }): Promise<EmailResult> {
    const { orderDeliveredTemplate } = await import('../templates/order-delivered.template');
    return this.send({
      to,
      subject: `Your Order #${orderData.orderNumber} Has Been Delivered! ✅`,
      html: orderDeliveredTemplate(orderData),
    });
  }

  async sendLowStockAlert(to: string, products: Array<{ name: string; currentStock: number; threshold: number; sku?: string }>): Promise<EmailResult> {
    const { lowStockAlertTemplate } = await import('../templates/low-stock-alert.template');
    return this.send({
      to,
      subject: `⚠️ Low Stock Alert: ${products.length} product(s) need attention`,
      html: lowStockAlertTemplate({ products }),
    });
  }
}

// Export a facade class that can be instantiated without dependency injection
export class EmailFacadeService {
  private readonly logger = new Logger('EmailFacadeService');
  private resendProvider: ResendProvider;
  private smtpProvider: SmtpProvider;
  private primaryProvider: IEmailProvider | null = null;
  private fallbackProvider: IEmailProvider | null = null;

  constructor(private configService: ConfigService) {
    this.resendProvider = new ResendProvider(configService);
    this.smtpProvider = new SmtpProvider(configService);
    this.initializeProviders();
  }

  private initializeProviders() {
    const useResendPrimary = this.configService.get<string>('RESEND_PRIMARY', 'true') === 'true';

    if (useResendPrimary) {
      this.primaryProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
      this.fallbackProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
    } else {
      this.primaryProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
      this.fallbackProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
    }

    // If primary isn't available, use whatever is
    if (!this.primaryProvider && this.fallbackProvider) {
      this.primaryProvider = this.fallbackProvider;
      this.fallbackProvider = null;
    }

    if (this.primaryProvider) {
      this.logger.log(`Email primary provider: ${this.primaryProvider.getProviderName()}`);
    }
    if (this.fallbackProvider) {
      this.logger.log(`Email fallback provider: ${this.fallbackProvider.getProviderName()}`);
    }
    if (!this.primaryProvider) {
      this.logger.warn('No email provider configured - emails will not be sent');
    }
  }

  async sendRawEmail(options: EmailOptions): Promise<EmailResult> {
    if (!this.primaryProvider) {
      return { success: false, error: 'No email provider configured', provider: 'smtp' };
    }

    let result = await this.primaryProvider.send(options);

    if (!result.success && this.fallbackProvider) {
      this.logger.warn(`Primary provider failed, trying fallback`);
      result = await this.fallbackProvider.send(options);
    }

    return result;
  }
}
