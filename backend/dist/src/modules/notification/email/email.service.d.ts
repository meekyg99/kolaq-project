import { ConfigService } from '@nestjs/config';
import { EmailOptions, EmailResult } from './email-provider.interface';
import { ResendProvider } from './resend.provider';
import { SmtpProvider } from './smtp.provider';
export type EmailProviderType = 'resend' | 'smtp' | 'auto';
export declare class EmailService {
    private configService;
    private resendProvider;
    private smtpProvider;
    private readonly logger;
    private primaryProvider;
    private fallbackProvider;
    constructor(configService: ConfigService, resendProvider: ResendProvider, smtpProvider: SmtpProvider);
    private initializeProviders;
    isConfigured(): boolean;
    send(options: EmailOptions): Promise<EmailResult>;
    sendWelcomeEmail(to: string, customerName: string): Promise<EmailResult>;
    sendPasswordResetEmail(to: string, resetToken: string, customerName: string): Promise<EmailResult>;
    sendOrderConfirmation(to: string, orderData: {
        customerName: string;
        orderNumber: string;
        items: Array<{
            name: string;
            quantity: number;
            price: number;
            size?: string;
        }>;
        subtotal: number;
        shippingCost: number;
        total: number;
        currency: string;
        shippingAddress: string;
        estimatedDelivery?: string;
    }): Promise<EmailResult>;
    sendOrderProcessing(to: string, orderData: {
        customerName: string;
        orderNumber: string;
        message?: string;
    }): Promise<EmailResult>;
    sendOrderShipped(to: string, orderData: {
        customerName: string;
        orderNumber: string;
        trackingNumber?: string;
        trackingUrl?: string;
        carrier?: string;
        estimatedDelivery?: string;
    }): Promise<EmailResult>;
    sendOrderDelivered(to: string, orderData: {
        customerName: string;
        orderNumber: string;
    }): Promise<EmailResult>;
    sendLowStockAlert(to: string, products: Array<{
        name: string;
        currentStock: number;
        threshold: number;
        sku?: string;
    }>): Promise<EmailResult>;
}
export declare class EmailFacadeService {
    private configService;
    private readonly logger;
    private resendProvider;
    private smtpProvider;
    private primaryProvider;
    private fallbackProvider;
    constructor(configService: ConfigService);
    private initializeProviders;
    sendRawEmail(options: EmailOptions): Promise<EmailResult>;
}
