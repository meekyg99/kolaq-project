import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersSyncTask {
  private readonly logger = new Logger(OrdersSyncTask.name);

  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Sync all active shipments every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async syncActiveShipments() {
    this.logger.log('Starting scheduled shipment sync...');
    
    try {
      const result = await this.ordersService.syncAllActiveShipments();
      this.logger.log(
        `Shipment sync completed: ${result.successful} successful, ${result.failed} failed out of ${result.total} total`,
      );
    } catch (error) {
      this.logger.error('Scheduled shipment sync failed', error);
    }
  }

  /**
   * Sync active shipments every 30 minutes during business hours (9 AM - 6 PM WAT)
   * This runs more frequently to keep customers updated
   */
  @Cron('*/30 9-18 * * *')
  async syncActiveShipmentsBusinessHours() {
    this.logger.log('Starting business hours shipment sync...');
    
    try {
      const result = await this.ordersService.syncAllActiveShipments();
      this.logger.log(
        `Business hours sync completed: ${result.successful} successful, ${result.failed} failed`,
      );
    } catch (error) {
      this.logger.error('Business hours shipment sync failed', error);
    }
  }
}
