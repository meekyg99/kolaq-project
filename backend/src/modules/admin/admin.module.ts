import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AnalyticsService } from './analytics.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [AdminController],
  providers: [AdminService, AnalyticsService],
  exports: [AdminService, AnalyticsService],
})
export class AdminModule {}
