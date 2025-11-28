import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { validateEnv } from './config/env.validation';
import { loggerConfig } from './config/logger.config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderService } from './modules/order/order.service';
import { NotificationService } from './modules/notification/notification.service';
import { ActivityModule } from './modules/activity/activity.module';
import { OrdersModule } from './modules/orders/orders.module';
import { JobsModule } from './jobs/jobs.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 50, // 50 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    CatalogModule,
    InventoryModule,
    CartModule,
    OrderModule,
    NotificationModule,
    AdminModule,
    ActivityModule,
    OrdersModule,
    JobsModule,
    MonitoringModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly orderService: OrderService,
    private readonly notificationService: NotificationService,
  ) {}

  onModuleInit() {
    // Inject notification service into order service
    this.orderService.setNotificationService(this.notificationService);
  }
}
