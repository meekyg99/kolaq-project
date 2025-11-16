import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Controller('api/v1/inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    @InjectQueue('inventory') private inventoryQueue: Queue,
  ) {}

  @Post('adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  adjustInventory(@Body() adjustInventoryDto: AdjustInventoryDto) {
    return this.inventoryService.adjustInventory(adjustInventoryDto);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getHistory(@Query() query: QueryInventoryDto) {
    return this.inventoryService.getInventoryHistory(query);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getSummary() {
    return this.inventoryService.getInventorySummary();
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getLowStock() {
    return this.inventoryService.getLowStockProducts();
  }

  @Get('product/:productId')
  getProductInventory(@Param('productId') productId: string) {
    return this.inventoryService.getProductInventory(productId);
  }

  @Post('reconcile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async triggerReconciliation(@Body() body: { productId?: string; threshold?: number }) {
    const job = await this.inventoryQueue.add('reconcile', {
      productId: body.productId,
      threshold: body.threshold || 10,
    });

    return {
      message: 'Inventory reconciliation job queued',
      jobId: job.id,
      productId: body.productId || 'all',
    };
  }

  @Post('check-low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async triggerLowStockCheck() {
    const job = await this.inventoryQueue.add('low-stock-check', {});

    return {
      message: 'Low stock check job queued',
      jobId: job.id,
    };
  }
}
