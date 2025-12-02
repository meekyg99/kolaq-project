import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SmsService } from './sms.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [NotificationController],
  providers: [NotificationService, SmsService],
  exports: [NotificationService, SmsService],
})
export class NotificationModule {}
