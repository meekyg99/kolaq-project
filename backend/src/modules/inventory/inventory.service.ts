import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private readonly LOW_STOCK_THRESHOLD = 10;

  constructor(private readonly prisma: PrismaService) {}

  async adjustInventory(adjustInventoryDto: AdjustInventoryDto) {
    const { productId, delta, reason, actorEmail } = adjustInventoryDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }

    const currentStock = await this.getCurrentStock(productId);

    if (currentStock + delta < 0) {
      throw new BadRequestException(
        `Insufficient stock. Current: ${currentStock}, Requested: ${delta}`,
      );
    }

    const event = await this.prisma.inventoryEvent.create({
      data: {
        productId,
        delta,
        reason,
        actorEmail,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const newStock = currentStock + delta;

    this.logger.log(
      `Inventory adjusted for ${product.name}: ${currentStock} -> ${newStock} (${delta > 0 ? '+' : ''}${delta})`,
    );

    if (newStock <= this.LOW_STOCK_THRESHOLD && delta < 0) {
      this.logger.warn(
        `Low stock alert for ${product.name}: ${newStock} units remaining`,
      );
    }

    return {
      event,
      previousStock: currentStock,
      newStock,
      lowStockAlert: newStock <= this.LOW_STOCK_THRESHOLD,
    };
  }

  async getCurrentStock(productId: string): Promise<number> {
    const events = await this.prisma.inventoryEvent.findMany({
      where: { productId },
      select: { delta: true },
    });

    return events.reduce((total, event) => total + event.delta, 0);
  }

  async getInventoryHistory(query: QueryInventoryDto) {
    const { productId, limit = 50, offset = 0 } = query;

    const where = productId ? { productId } : {};

    const events = await this.prisma.inventoryEvent.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.inventoryEvent.count({ where });

    return {
      events,
      total,
      limit,
      offset,
    };
  }

  async getProductInventory(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }

    const currentStock = await this.getCurrentStock(productId);

    const recentEvents = await this.prisma.inventoryEvent.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
      },
      currentStock,
      lowStockAlert: currentStock <= this.LOW_STOCK_THRESHOLD,
      recentEvents,
    };
  }

  async getLowStockProducts() {
    const allProducts = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
      },
    });

    const lowStockProducts = [];

    for (const product of allProducts) {
      const stock = await this.getCurrentStock(product.id);
      if (stock <= this.LOW_STOCK_THRESHOLD) {
        lowStockProducts.push({
          ...product,
          currentStock: stock,
        });
      }
    }

    return lowStockProducts.sort((a, b) => a.currentStock - b.currentStock);
  }

  async getInventorySummary() {
    const allProducts = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const product of allProducts) {
      const stock = await this.getCurrentStock(product.id);
      totalStock += stock;

      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= this.LOW_STOCK_THRESHOLD) {
        lowStockCount++;
      }
    }

    return {
      totalProducts: allProducts.length,
      totalStock,
      lowStockCount,
      outOfStockCount,
      lowStockThreshold: this.LOW_STOCK_THRESHOLD,
    };
  }
}
