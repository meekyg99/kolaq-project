import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class InventoryScheduler {
  private readonly logger = new Logger(InventoryScheduler.name);

  constructor(
    @InjectQueue('inventory') private inventoryQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduleInventoryReconciliation() {
    this.logger.log('Scheduling daily inventory reconciliation');
    
    await this.inventoryQueue.add('reconcile', {
      checkLowStock: true,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async scheduleLowStockCheck() {
    this.logger.log('Scheduling daily low stock check');
    
    await this.inventoryQueue.add('low-stock-check', {}, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }
}
