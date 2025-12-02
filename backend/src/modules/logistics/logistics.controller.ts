import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Get('quote')
  async getQuote(
    @Query('originState') originState: string,
    @Query('destinationState') destinationState: string,
    @Query('weight') weight: string,
    @Query('deliveryType') deliveryType?: 'STANDARD' | 'EXPRESS' | 'SAME_DAY',
  ) {
    const quote = await this.logisticsService.getDeliveryQuote(
      originState,
      destinationState,
      parseFloat(weight),
      deliveryType || 'STANDARD',
    );

    return {
      success: true,
      data: quote,
    };
  }

  @Get('track/:waybillNumber')
  async trackShipment(@Param('waybillNumber') waybillNumber: string) {
    const tracking = await this.logisticsService.trackShipment(waybillNumber);

    return {
      success: true,
      data: tracking,
    };
  }

  @Post('pickup/schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async schedulePickup(
    @Body() body: { orderId: string; pickupDate: string },
  ) {
    const success = await this.logisticsService.schedulePickup(
      body.orderId,
      new Date(body.pickupDate),
    );

    return {
      success,
      message: success ? 'Pickup scheduled successfully' : 'Failed to schedule pickup',
    };
  }

  @Get('calculate-cost')
  async calculateCost(
    @Query('originState') originState: string,
    @Query('destinationState') destinationState: string,
    @Query('weight') weight: string,
    @Query('deliveryType') deliveryType?: 'STANDARD' | 'EXPRESS' | 'SAME_DAY',
  ) {
    const cost = await this.logisticsService.calculateShippingCost(
      originState,
      destinationState,
      parseFloat(weight),
      deliveryType || 'STANDARD',
    );

    return {
      success: true,
      cost,
    };
  }
}
