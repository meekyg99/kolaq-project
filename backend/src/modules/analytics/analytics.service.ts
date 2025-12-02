import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DashboardMetrics {
  // Sales Metrics
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowth: number; // percentage

  // Order Metrics
  totalOrders: number;
  ordersToday: number;
  ordersThisMonth: number;
  ordersLastMonth: number;
  orderGrowth: number; // percentage

  // Performance Metrics
  averageOrderValue: number;
  conversionRate: number;

  // Status Breakdown
  ordersByStatus: Record<string, number>;

  // Top Performers
  topProducts: Array<{
    id: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
    unitsSold: number;
  }>;

  topStates: Array<{
    state: string;
    orders: number;
    revenue: number;
  }>;

  // Recent Activity
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: Date;
  }>;

  // Trends
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics(days: number = 30): Promise<DashboardMetrics> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const daysAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Parallel queries for performance
    const [
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      totalOrders,
      ordersToday,
      ordersThisMonth,
      ordersLastMonth,
      ordersByStatus,
      topProducts,
      topStates,
      recentOrders,
      dailyRevenue,
    ] = await Promise.all([
      this.getTotalRevenue(),
      this.getRevenueForPeriod(startOfMonth, now),
      this.getRevenueForPeriod(startOfLastMonth, endOfLastMonth),
      this.getTotalOrders(),
      this.getOrdersForPeriod(startOfToday, now),
      this.getOrdersForPeriod(startOfMonth, now),
      this.getOrdersForPeriod(startOfLastMonth, endOfLastMonth),
      this.getOrdersByStatus(),
      this.getTopProducts(10),
      this.getTopStates(10),
      this.getRecentOrders(10),
      this.getDailyRevenue(daysAgo, now),
    ]);

    // Calculate growth rates
    const revenueGrowth = this.calculateGrowth(revenueThisMonth, revenueLastMonth);
    const orderGrowth = this.calculateGrowth(ordersThisMonth, ordersLastMonth);

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Estimate conversion rate (orders / site visits - would need tracking)
    const conversionRate = 2.5; // Placeholder - integrate with analytics later

    return {
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      revenueGrowth,
      totalOrders,
      ordersToday,
      ordersThisMonth,
      ordersLastMonth,
      orderGrowth,
      averageOrderValue,
      conversionRate,
      ordersByStatus,
      topProducts,
      topStates,
      recentOrders,
      dailyRevenue,
    };
  }

  /**
   * Get total revenue all time
   */
  private async getTotalRevenue(): Promise<number> {
    const result = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ['PAID', 'PROCESSING', 'READY_FOR_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'],
        },
      },
    });

    return result._sum.total ? Number(result._sum.total) : 0;
  }

  /**
   * Get revenue for a specific period
   */
  private async getRevenueForPeriod(start: Date, end: Date): Promise<number> {
    const result = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        status: {
          in: ['PAID', 'PROCESSING', 'READY_FOR_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'],
        },
      },
    });

    return result._sum.total ? Number(result._sum.total) : 0;
  }

  /**
   * Get total orders all time
   */
  private async getTotalOrders(): Promise<number> {
    return this.prisma.order.count();
  }

  /**
   * Get orders count for a specific period
   */
  private async getOrdersForPeriod(start: Date, end: Date): Promise<number> {
    return this.prisma.order.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  /**
   * Get orders breakdown by status
   */
  private async getOrdersByStatus(): Promise<Record<string, number>> {
    const orders = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    return orders.reduce((acc, order) => {
      acc[order.status] = order._count;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Get top selling products
   */
  private async getTopProducts(limit: number = 10) {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          price: 'desc',
        },
      },
      take: limit,
    });

    // Fetch product details
    const productIds = topProducts.map((p) => p.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p.name]));

    return topProducts.map((p) => ({
      id: p.productId,
      name: productMap.get(p.productId) || 'Unknown Product',
      totalSales: p._count.id,
      totalRevenue: p._sum.price ? Number(p._sum.price) : 0,
      unitsSold: p._sum.quantity || 0,
    }));
  }

  /**
   * Get top states by orders
   */
  private async getTopStates(limit: number = 10) {
    const stateData = await this.prisma.order.groupBy({
      by: ['shippingState'],
      _count: true,
      _sum: {
        total: true,
      },
      where: {
        shippingState: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          shippingState: 'desc',
        },
      },
      take: limit,
    });

    return stateData.map((s) => ({
      state: s.shippingState || 'Unknown',
      orders: s._count,
      revenue: s._sum.total ? Number(s._sum.total) : 0,
    }));
  }

  /**
   * Get recent orders
   */
  private async getRecentOrders(limit: number = 10) {
    const orders = await this.prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt,
    }));
  }

  /**
   * Get daily revenue trend
   */
  private async getDailyRevenue(start: Date, end: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        status: {
          in: ['PAID', 'PROCESSING', 'READY_FOR_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'],
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Group by date
    const dailyData = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const existing = dailyData.get(date) || { revenue: 0, orders: 0 };
      dailyData.set(date, {
        revenue: existing.revenue + Number(order.total),
        orders: existing.orders + 1,
      });
    });

    // Convert to array and sort by date
    return Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Calculate growth percentage
   */
  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Get product performance analytics
   */
  async getProductAnalytics(productId: string) {
    const [totalSales, totalRevenue, recentOrders, dailySales] = await Promise.all([
      this.prisma.orderItem.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          productId,
        },
      }),
      this.prisma.orderItem.aggregate({
        _sum: {
          price: true,
        },
        where: {
          productId,
        },
      }),
      this.prisma.orderItem.findMany({
        where: {
          productId,
        },
        include: {
          order: {
            select: {
              orderNumber: true,
              customerName: true,
              createdAt: true,
              status: true,
            },
          },
        },
        orderBy: {
          order: {
            createdAt: 'desc',
          },
        },
        take: 10,
      }),
      this.getProductDailySales(productId, 30),
    ]);

    return {
      totalSales: totalSales._sum.quantity || 0,
      totalRevenue: totalRevenue._sum.price ? Number(totalRevenue._sum.price) : 0,
      averagePrice:
        totalSales._sum.quantity && totalRevenue._sum.price
          ? Number(totalRevenue._sum.price) / totalSales._sum.quantity
          : 0,
      recentOrders: recentOrders.map((item) => ({
        orderNumber: item.order.orderNumber,
        customerName: item.order.customerName,
        quantity: item.quantity,
        price: item.price,
        date: item.order.createdAt,
        status: item.order.status,
      })),
      dailySales,
    };
  }

  /**
   * Get product daily sales
   */
  private async getProductDailySales(productId: string, days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await this.prisma.orderItem.findMany({
      where: {
        productId,
        order: {
          createdAt: {
            gte: startDate,
          },
        },
      },
      include: {
        order: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    // Group by date
    const dailyData = new Map<string, { quantity: number; revenue: number }>();

    sales.forEach((item) => {
      const date = item.order.createdAt.toISOString().split('T')[0];
      const existing = dailyData.get(date) || { quantity: 0, revenue: 0 };
      dailyData.set(date, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + Number(item.price),
      });
    });

    return Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics() {
    const [totalCustomers, repeatCustomers, topCustomers] = await Promise.all([
      this.prisma.order.groupBy({
        by: ['customerEmail'],
        _count: true,
      }),
      this.prisma.order.groupBy({
        by: ['customerEmail'],
        _count: true,
        having: {
          customerEmail: {
            _count: {
              gt: 1,
            },
          },
        },
      }),
      this.prisma.order.groupBy({
        by: ['customerEmail', 'customerName'],
        _sum: {
          total: true,
        },
        _count: true,
        orderBy: {
          _sum: {
            total: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      totalCustomers: totalCustomers.length,
      repeatCustomers: repeatCustomers.length,
      repeatRate: (repeatCustomers.length / totalCustomers.length) * 100,
      topCustomers: topCustomers.map((c) => ({
        email: c.customerEmail,
        name: c.customerName,
        orders: c._count,
        totalSpent: c._sum.total || 0,
      })),
    };
  }
}
