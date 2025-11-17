import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsQueryDto, TimeRange } from './dto/analytics.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSalesMetrics(query: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        paymentStatus: 'COMPLETED',
      },
      include: {
        items: true,
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const currencyBreakdown = orders.reduce(
      (acc, order) => {
        const currency = order.currency;
        acc[currency] = (acc[currency] || 0) + Number(order.total);
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalItems = orders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0,
    );

    const dailySales = await this.getDailySales(startDate, endDate);

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalItems,
        currencyBreakdown,
      },
      dailySales,
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    };
  }

  async getProductPerformance(query: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const productSales = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        order: {
          paymentStatus: 'COMPLETED',
        },
      },
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
    });

    const productsWithDetails = await Promise.all(
      productSales.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            category: true,
            image: true,
          },
        });

        const revenue = await this.prisma.orderItem.aggregate({
          where: {
            productId: item.productId,
            createdAt: { gte: startDate, lte: endDate },
            order: {
              paymentStatus: 'COMPLETED',
            },
          },
          _sum: {
            price: true,
          },
        });

        return {
          product,
          unitsSold: item._sum.quantity || 0,
          orderCount: item._count.id,
          revenue: Number(revenue._sum.price || 0),
        };
      }),
    );

    return productsWithDetails
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);
  }

  async getInventoryStatus() {
    const products = await this.prisma.product.findMany({
      include: {
        variants: {
          where: { isActive: true },
        },
        _count: {
          select: { inventoryEvents: true },
        },
      },
    });

    const lowStockThreshold = 10;
    const outOfStockThreshold = 0;

    const inventory = products.map((product) => {
      const totalStock = product.variants.reduce(
        (sum, v) => sum + v.stock,
        0,
      );
      const averageStock = product.variants.length > 0 
        ? totalStock / product.variants.length 
        : 0;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        totalStock,
        variants: product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          bottleSize: v.bottleSize,
          stock: v.stock,
          status:
            v.stock <= outOfStockThreshold
              ? 'OUT_OF_STOCK'
              : v.stock <= lowStockThreshold
                ? 'LOW_STOCK'
                : 'IN_STOCK',
        })),
        status:
          totalStock <= outOfStockThreshold
            ? 'OUT_OF_STOCK'
            : averageStock <= lowStockThreshold
              ? 'LOW_STOCK'
              : 'IN_STOCK',
        eventsCount: product._count.inventoryEvents,
      };
    });

    const summary = {
      totalProducts: products.length,
      inStock: inventory.filter((i) => i.status === 'IN_STOCK').length,
      lowStock: inventory.filter((i) => i.status === 'LOW_STOCK').length,
      outOfStock: inventory.filter((i) => i.status === 'OUT_OF_STOCK').length,
    };

    return { summary, inventory };
  }

  async getInventoryForecast(days: number = 30, productId?: string) {
    const lookbackDays = days * 2;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - lookbackDays);

    const whereClause: any = {
      createdAt: { gte: startDate },
      order: { paymentStatus: 'COMPLETED' },
    };

    if (productId) {
      whereClause.productId = productId;
    }

    const historicalSales = await this.prisma.orderItem.findMany({
      where: whereClause,
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const productForecasts: any[] = [];

    const productGroups = historicalSales.reduce(
      (acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = [];
        }
        acc[item.productId].push(item);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    for (const [prodId, sales] of Object.entries(productGroups)) {
      const salesArray = sales as any[];
      const product = salesArray[0].product;
      const totalQuantitySold = salesArray.reduce((sum, s) => sum + s.quantity, 0);
      const dailyAverage = totalQuantitySold / lookbackDays;
      const forecastedDemand = Math.ceil(dailyAverage * days);

      const currentStock = product.variants.reduce(
        (sum, v) => sum + v.stock,
        0,
      );

      const projectedStockout =
        dailyAverage > 0 ? Math.floor(currentStock / dailyAverage) : null;

      const reorderPoint = Math.ceil(dailyAverage * 7);
      const needsReorder = currentStock < reorderPoint;

      productForecasts.push({
        productId: prodId,
        productName: product.name,
        currentStock,
        dailyAverageSales: Number(dailyAverage.toFixed(2)),
        forecastedDemand,
        projectedStockoutDays: projectedStockout,
        reorderPoint,
        needsReorder,
        recommendedOrderQuantity: needsReorder
          ? forecastedDemand + reorderPoint - currentStock
          : 0,
      });
    }

    return {
      forecastPeriodDays: days,
      lookbackPeriodDays: lookbackDays,
      forecasts: productForecasts.sort((a, b) => {
        if (a.needsReorder && !b.needsReorder) return -1;
        if (!a.needsReorder && b.needsReorder) return 1;
        return (a.projectedStockoutDays || 999) - (b.projectedStockoutDays || 999);
      }),
    };
  }

  async getCustomerMetrics(query: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        paymentStatus: 'COMPLETED',
      },
      select: {
        customerEmail: true,
        total: true,
        createdAt: true,
      },
    });

    const uniqueCustomers = new Set(orders.map((o) => o.customerEmail)).size;
    const returningCustomers = orders.reduce((acc, order) => {
      const customerOrders = orders.filter(
        (o) => o.customerEmail === order.customerEmail,
      );
      if (customerOrders.length > 1) {
        acc.add(order.customerEmail);
      }
      return acc;
    }, new Set()).size;

    const totalCustomerValue = orders.reduce(
      (sum, o) => sum + Number(o.total),
      0,
    );
    const averageCustomerValue =
      uniqueCustomers > 0 ? totalCustomerValue / uniqueCustomers : 0;

    return {
      uniqueCustomers,
      returningCustomers,
      newCustomers: uniqueCustomers - returningCustomers,
      averageCustomerValue,
      retentionRate:
        uniqueCustomers > 0 ? (returningCustomers / uniqueCustomers) * 100 : 0,
    };
  }

  private async getDailySales(startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        paymentStatus: 'COMPLETED',
      },
      select: {
        createdAt: true,
        total: true,
        currency: true,
      },
    });

    const dailyMap = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const current = dailyMap.get(dateKey) || { revenue: 0, orders: 0 };
      dailyMap.set(dateKey, {
        revenue: current.revenue + Number(order.total),
        orders: current.orders + 1,
      });
    });

    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private getDateRange(query: AnalyticsQueryDto): {
    startDate: Date;
    endDate: Date;
  } {
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    let startDate: Date;

    if (query.range === TimeRange.CUSTOM && query.startDate) {
      startDate = new Date(query.startDate);
    } else {
      startDate = new Date();
      switch (query.range) {
        case TimeRange.TODAY:
          startDate.setHours(0, 0, 0, 0);
          break;
        case TimeRange.WEEK:
          startDate.setDate(startDate.getDate() - 7);
          break;
        case TimeRange.MONTH:
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case TimeRange.QUARTER:
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case TimeRange.YEAR:
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1);
      }
    }

    return { startDate, endDate };
  }
}
