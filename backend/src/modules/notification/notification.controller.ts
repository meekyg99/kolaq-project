import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationService.sendNotification(dto);
  }

  @Post('order/:orderId/confirmation')
  sendOrderConfirmation(@Param('orderId') orderId: string) {
    return this.notificationService.sendOrderConfirmation(orderId);
  }

  @Post('order/:orderId/status-update')
  sendOrderStatusUpdate(
    @Param('orderId') orderId: string,
    @Body() body: { status: string; message?: string },
  ) {
    return this.notificationService.sendOrderStatusUpdate(
      orderId,
      body.status,
      body.message,
    );
  }

  @Get()
  findAll(@Query() query: QueryNotificationDto) {
    return this.notificationService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.notificationService.getStats();
  }
}
