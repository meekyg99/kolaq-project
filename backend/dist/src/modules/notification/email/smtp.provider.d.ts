import { ConfigService } from '@nestjs/config';
import { IEmailProvider, EmailOptions, EmailResult } from './email-provider.interface';
export declare class SmtpProvider implements IEmailProvider {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    isConfigured(): boolean;
    getProviderName(): string;
    send(options: EmailOptions): Promise<EmailResult>;
}
