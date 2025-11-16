import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private config;
    private readonly logger;
    private resend;
    constructor(config: ConfigService);
    sendEmail(data: {
        to: string | string[];
        subject: string;
        html: string;
        from?: string;
    }): Promise<import("resend").CreateEmailResponse>;
    sendOrderConfirmation(orderId: string, email: string): Promise<import("resend").CreateEmailResponse>;
    sendLowStockAlert(productName: string, currentStock: number): Promise<import("resend").CreateEmailResponse>;
    sendBroadcast(recipients: string[], subject: string, html: string): Promise<{
        success: number;
        failed: number;
    }>;
}
