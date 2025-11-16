import { Controller, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  async health() {
    return this.monitoringService.healthCheck();
  }

  @Get('metrics')
  async metrics() {
    return this.monitoringService.getMetrics();
  }

  @Get('status')
  async status() {
    return this.monitoringService.getSystemStatus();
  }
}
