import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './processors/email.processor';
import { InventoryProcessor } from './processors/inventory.processor';
import { EmailService } from './services/email.service';
import { InventoryScheduler } from './schedulers/inventory.scheduler';
import { PrismaService } from '../modules/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL');
        
        // If Redis is not configured, return a dummy config
        // Bull will fail gracefully and jobs won't run
        if (!redisUrl) {
          console.warn('⚠️  Redis not configured - Background jobs will be disabled');
          return {
            redis: {
              host: 'localhost',
              port: 6379,
              maxRetriesPerRequest: 1,
              enableOfflineQueue: false,
              connectTimeout: 1000,
              lazyConnect: true,
            },
          };
        }
        
        // If REDIS_URL is provided (Railway format), use it
        return { redis: redisUrl };
      },
    }),
    BullModule.registerQueue(
      { name: 'emails' },
      { name: 'inventory' },
      { name: 'webhooks' },
    ),
  ],
  providers: [
    EmailProcessor,
    InventoryProcessor,
    EmailService,
    InventoryScheduler,
    PrismaService,
  ],
  exports: [BullModule, EmailService],
})
export class JobsModule {}
