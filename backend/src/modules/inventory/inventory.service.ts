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

  /**
   * Deduct inventory for order items (called when order is paid)
   */
  async deductInventoryForOrder(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<{
    success: boolean;
    lowStockAlerts: Array<{ productId: string; productName: string; currentStock: number }>;
  }> {
    const lowStockAlerts = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true },
      });

      if (!product) {
        this.logger.error(`Product ${item.productId} not found for inventory deduction`);
        continue;
      }

      // Deduct inventory
      const result = await this.adjustInventory({
        productId: item.productId,
        delta: -item.quantity,
        reason: `Order ${orderId} placed`,
        actorEmail: 'system@kolaqalagbo.org',
      });

      // Check for low stock
      if (result.lowStockAlert) {
        lowStockAlerts.push({
          productId: item.productId,
          productName: product.name,
          currentStock: result.newStock,
        });

        this.logger.warn(
          `LOW STOCK: ${product.name} now has ${result.newStock} units (threshold: ${this.LOW_STOCK_THRESHOLD})`,
        );
      }
    }

    return {
      success: true,
      lowStockAlerts,
    };
  }

  /**
   * Restore inventory when order is cancelled or refunded
   */
  async restoreInventoryForOrder(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<boolean> {
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true },
      });

      if (!product) {
        this.logger.error(`Product ${item.productId} not found for inventory restoration`);
        continue;
      }

      // Restore inventory
      await this.adjustInventory({
        productId: item.productId,
        delta: item.quantity,
        reason: `Order ${orderId} cancelled/refunded`,
        actorEmail: 'system@kolaqalagbo.org',
      });

      this.logger.log(`Inventory restored for ${product.name}: +${item.quantity} units`);
    }

    return true;
  }

  /**
   * Check if products are in stock before checkout
   */
  async checkStockAvailability(
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<{
    available: boolean;
    outOfStock: Array<{ productId: string; productName: string; available: number; requested: number }>;
  }> {
    const outOfStock = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true },
      });

      if (!product) {
        outOfStock.push({
          productId: item.productId,
          productName: 'Unknown Product',
          available: 0,
          requested: item.quantity,
        });
        continue;
      }

      const currentStock = await this.getCurrentStock(item.productId);

      if (currentStock < item.quantity) {
        outOfStock.push({
          productId: item.productId,
          productName: product.name,
          available: currentStock,
          requested: item.quantity,
        });
      }
    }

    return {
      available: outOfStock.length === 0,
      outOfStock,
    };
  }

  /**
   * Set LOW_STOCK_THRESHOLD dynamically
   */
  setLowStockThreshold(threshold: number): void {
    (this as any).LOW_STOCK_THRESHOLD = threshold;
    this.logger.log(`Low stock threshold updated to ${threshold}`);
  }

  /**
   * Get inventory value (for reporting)
   */
  async getInventoryValue(): Promise<{
    totalValue: number;
    breakdown: Array<{
      productId: string;
      productName: string;
      stock: number;
      price: number;
      value: number;
    }>;
  }> {
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        prices: {
          where: {
            currency: 'NGN',
          },
          take: 1,
        },
      },
    });

    const breakdown = [];
    let totalValue = 0;

    for (const product of products) {
      const stock = await this.getCurrentStock(product.id);
      const price = product.prices[0] ? Number(product.prices[0].amount) : 0;
      const value = stock * price;
      totalValue += value;

      breakdown.push({
        productId: product.id,
        productName: product.name,
        stock,
        price,
        value,
      });
    }

    return {
      totalValue,
      breakdown: breakdown.sort((a, b) => b.value - a.value),
    };
  }
}
