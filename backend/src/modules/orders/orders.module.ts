import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersSyncTask } from './orders-sync.task';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivityModule } from '../activity/activity.module';
import { LogisticsModule } from '../logistics/logistics.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, ActivityModule, LogisticsModule, NotificationModule],
  providers: [OrdersService, OrdersSyncTask],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
