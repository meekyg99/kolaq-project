import { ConfigService } from '@nestjs/config';
import { IEmailProvider, EmailOptions, EmailResult } from './email-provider.interface';
export declare class ResendProvider implements IEmailProvider {
    private configService;
    private readonly logger;
    private resend;
    constructor(configService: ConfigService);
    isConfigured(): boolean;
    getProviderName(): string;
    send(options: EmailOptions): Promise<EmailResult>;
}
