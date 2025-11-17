import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AnalyticsService } from './analytics.service';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { AnalyticsQueryDto, ForecastQueryDto } from './dto/analytics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics')
  getAnalytics(@Query('days') days?: string) {
    const numDays = days ? parseInt(days, 10) : 30;
    return this.adminService.getAnalytics(numDays);
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit?: string) {
    const numLimit = limit ? parseInt(limit, 10) : 10;
    return this.adminService.getTopProducts(numLimit);
  }

  @Get('customer-insights')
  getCustomerInsights() {
    return this.adminService.getCustomerInsights();
  }

  @Post('broadcast')
  broadcast(@Body() dto: BroadcastNotificationDto) {
    return this.adminService.broadcastNotification(dto);
  }

  @Get('activity')
  getActivity(@Query() query: QueryActivityDto) {
    return this.adminService.getActivityLogs(query);
  }

  @Get('activity/stats')
  getActivityStats() {
    return this.adminService.getActivityStats();
  }

  @Post('activity/log')
  logActivity(@Body() data: any, @Req() req: any) {
    const user = req.user;
    return this.adminService.logActivity({
      ...data,
      userId: user?.id,
      userEmail: user?.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Get('analytics/sales')
  @ApiOperation({ summary: 'Get sales metrics and revenue data' })
  getSalesMetrics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getSalesMetrics(query);
  }

  @Get('analytics/products')
  @ApiOperation({ summary: 'Get product performance metrics' })
  getProductPerformance(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getProductPerformance(query);
  }

  @Get('analytics/inventory')
  @ApiOperation({ summary: 'Get inventory status and stock levels' })
  getInventoryStatus() {
    return this.analyticsService.getInventoryStatus();
  }

  @Get('analytics/forecast')
  @ApiOperation({ summary: 'Get inventory forecast and reorder recommendations' })
  getInventoryForecast(@Query() query: ForecastQueryDto) {
    return this.analyticsService.getInventoryForecast(
      query.days,
      query.productId,
    );
  }

  @Get('analytics/customers')
  @ApiOperation({ summary: 'Get customer acquisition and retention metrics' })
  getCustomerMetrics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getCustomerMetrics(query);
  }
}
