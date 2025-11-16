import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as os from 'os';

@Injectable()
export class MonitoringService {
  constructor(private readonly prisma: PrismaService) {}

  async healthCheck() {
    try {
      // Check database
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  async getMetrics() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    // Get database stats
    const [
      productCount,
      orderCount,
      adminUserCount,
      cartCount,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.adminUser.count(),
      this.prisma.cart.count(),
    ]);

    return {
      timestamp: new Date().toISOString(),
      process: {
        uptime: process.uptime(),
        pid: process.pid,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
        cpu: {
          user: `${Math.round(cpuUsage.user / 1000)}ms`,
          system: `${Math.round(cpuUsage.system / 1000)}ms`,
        },
      },
      database: {
        products: productCount,
        orders: orderCount,
        adminUsers: adminUserCount,
        carts: cartCount,
      },
    };
  }

  async getSystemStatus() {
    const loadAverage = os.loadavg();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    return {
      timestamp: new Date().toISOString(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        uptime: os.uptime(),
        loadAverage: loadAverage.map((load) => load.toFixed(2)),
        memory: {
          total: `${Math.round(totalMemory / 1024 / 1024 / 1024)}GB`,
          free: `${Math.round(freeMemory / 1024 / 1024 / 1024)}GB`,
          used: `${Math.round((totalMemory - freeMemory) / 1024 / 1024 / 1024)}GB`,
          usagePercent: `${Math.round(((totalMemory - freeMemory) / totalMemory) * 100)}%`,
        },
        cpu: {
          count: os.cpus().length,
          model: os.cpus()[0].model,
        },
      },
      application: await this.healthCheck(),
    };
  }
}
