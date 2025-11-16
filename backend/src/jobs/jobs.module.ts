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
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST') || 'localhost',
          port: parseInt(config.get('REDIS_PORT') || '6379', 10),
        },
      }),
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
