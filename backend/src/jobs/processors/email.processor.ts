import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../services/email.service';

export interface EmailJob {
  type: 'order_confirmation' | 'low_stock' | 'broadcast' | 'generic';
  data: any;
}

@Processor('emails')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private emailService: EmailService) {}

  @Process()
  async handleEmailJob(job: Job<EmailJob>) {
    this.logger.log(`Processing email job ${job.id}: ${job.data.type}`);

    try {
      switch (job.data.type) {
        case 'order_confirmation':
          await this.emailService.sendOrderConfirmation(
            job.data.data.orderId,
            job.data.data.email
          );
          break;

        case 'low_stock':
          await this.emailService.sendLowStockAlert(
            job.data.data.productName,
            job.data.data.currentStock
          );
          break;

        case 'broadcast':
          await this.emailService.sendBroadcast(
            job.data.data.recipients,
            job.data.data.subject,
            job.data.data.html
          );
          break;

        case 'generic':
          await this.emailService.sendEmail(job.data.data);
          break;

        default:
          this.logger.warn(`Unknown email job type: ${job.data.type}`);
      }

      this.logger.log(`Email job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Email job ${job.id} failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
