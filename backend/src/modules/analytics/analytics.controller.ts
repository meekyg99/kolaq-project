import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardMetrics(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    const metrics = await this.analyticsService.getDashboardMetrics(daysNum);

    return {
      success: true,
      data: metrics,
    };
  }

  @Get('products/:productId')
  async getProductAnalytics(@Param('productId') productId: string) {
    const analytics = await this.analyticsService.getProductAnalytics(productId);

    return {
      success: true,
      data: analytics,
    };
  }

  @Get('customers')
  async getCustomerAnalytics() {
    const analytics = await this.analyticsService.getCustomerAnalytics();

    return {
      success: true,
      data: analytics,
    };
  }
}
