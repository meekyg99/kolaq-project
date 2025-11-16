import { Job } from 'bullmq';
import { EmailService } from '../services/email.service';
export interface EmailJob {
    type: 'order_confirmation' | 'low_stock' | 'broadcast' | 'generic';
    data: any;
}
export declare class EmailProcessor {
    private emailService;
    private readonly logger;
    constructor(emailService: EmailService);
    handleEmailJob(job: Job<EmailJob>): Promise<void>;
}
