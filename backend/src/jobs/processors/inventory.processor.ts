import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

export interface InventoryReconciliationJob {
  productId?: string;
  checkLowStock?: boolean;
}

@Processor('inventory')
export class InventoryProcessor {
  private readonly logger = new Logger(InventoryProcessor.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('emails') private emailQueue: Queue,
  ) {}

  @Process('reconcile')
  async handleReconciliation(job: Job<InventoryReconciliationJob>) {
    this.logger.log(`Processing inventory reconciliation job ${job.id}`);

    try {
      const { productId } = job.data;

      const products = productId
        ? await this.prisma.product.findMany({ where: { id: productId } })
        : await this.prisma.product.findMany();

      for (const product of products) {
        const events = await this.prisma.inventoryEvent.findMany({
          where: { productId: product.id },
          orderBy: { createdAt: 'asc' },
        });

        const currentStock = events.reduce((sum, event) => sum + event.delta, 0);

        await this.prisma.activityLog.create({
          data: {
            type: 'INVENTORY_ADJUSTED',
            action: 'inventory.reconciled',
            description: `Reconciled ${product.name}: ${currentStock} units`,
            metadata: {
              productId: product.id,
              productName: product.name,
              calculatedStock: currentStock,
            },
          },
        });

        if (currentStock <= 10) {
          this.logger.warn(`Low stock detected for ${product.name}: ${currentStock}`);

          await this.emailQueue.add('email-job', {
            type: 'low_stock',
            data: {
              productName: product.name,
              currentStock,
            },
          });
        }
      }

      this.logger.log(`Inventory reconciliation job ${job.id} completed`);
    } catch (error) {
      this.logger.error(
        `Inventory reconciliation job ${job.id} failed: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  @Process('low-stock-check')
  async handleLowStockCheck(job: Job) {
    this.logger.log('Checking for low stock items');

    try {
      const products = await this.prisma.product.findMany();
      const lowStockProducts = [];

      for (const product of products) {
        const events = await this.prisma.inventoryEvent.findMany({
          where: { productId: product.id },
        });

        const currentStock = events.reduce((sum, event) => sum + event.delta, 0);

        if (currentStock <= 10) {
          lowStockProducts.push({
            name: product.name,
            stock: currentStock,
          });
        }
      }

      if (lowStockProducts.length > 0) {
        const alertHtml = `
          <h2>Low Stock Alert</h2>
          <p>The following products are running low:</p>
          <ul>
            ${lowStockProducts.map(p => `
              <li><strong>${p.name}</strong>: ${p.stock} units remaining</li>
            `).join('')}
          </ul>
        `;

        await this.emailQueue.add('email-job', {
          type: 'generic',
          data: {
            to: process.env.ADMIN_EMAIL,
            subject: 'Low Stock Alert',
            html: alertHtml,
          },
        });
      }

      this.logger.log('Low stock check completed');
    } catch (error) {
      this.logger.error(`Low stock check failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
