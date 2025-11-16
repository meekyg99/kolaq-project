import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

export interface InventoryReconciliationJob {
  productId?: string;
  checkLowStock?: boolean;
  threshold?: number;
}

export interface InventoryStockLevel {
  productId: string;
  productName: string;
  currentStock: number;
  status: 'ok' | 'low' | 'out_of_stock';
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
      const { productId, threshold = 10 } = job.data;

      const products = productId
        ? await this.prisma.product.findMany({ where: { id: productId } })
        : await this.prisma.product.findMany();

      const reconciliationReport: InventoryStockLevel[] = [];
      const lowStockItems: InventoryStockLevel[] = [];
      const outOfStockItems: InventoryStockLevel[] = [];

      for (const product of products) {
        const events = await this.prisma.inventoryEvent.findMany({
          where: { productId: product.id },
          orderBy: { createdAt: 'asc' },
        });

        const currentStock = events.reduce((sum, event) => sum + event.delta, 0);

        let status: 'ok' | 'low' | 'out_of_stock' = 'ok';
        if (currentStock === 0) {
          status = 'out_of_stock';
          outOfStockItems.push({
            productId: product.id,
            productName: product.name,
            currentStock,
            status,
          });
        } else if (currentStock <= threshold) {
          status = 'low';
          lowStockItems.push({
            productId: product.id,
            productName: product.name,
            currentStock,
            status,
          });
        }

        reconciliationReport.push({
          productId: product.id,
          productName: product.name,
          currentStock,
          status,
        });

        await this.prisma.activityLog.create({
          data: {
            type: 'INVENTORY_ADJUSTED',
            action: 'inventory.reconciled',
            description: `Reconciled ${product.name}: ${currentStock} units (${status})`,
            metadata: {
              productId: product.id,
              productName: product.name,
              calculatedStock: currentStock,
              status,
              threshold,
            },
          },
        });
      }

      if (lowStockItems.length > 0 || outOfStockItems.length > 0) {
        this.logger.warn(`Reconciliation found ${lowStockItems.length} low stock and ${outOfStockItems.length} out of stock items`);
        
        await this.sendReconciliationReport(lowStockItems, outOfStockItems);
      }

      this.logger.log(`Inventory reconciliation job ${job.id} completed. Processed ${products.length} products.`);
      return reconciliationReport;
    } catch (error) {
      this.logger.error(
        `Inventory reconciliation job ${job.id} failed: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  private async sendReconciliationReport(
    lowStockItems: InventoryStockLevel[],
    outOfStockItems: InventoryStockLevel[]
  ) {
    let alertHtml = '<h2>Inventory Reconciliation Report</h2>';

    if (outOfStockItems.length > 0) {
      alertHtml += `
        <h3 style="color: red;">⚠️ Out of Stock (${outOfStockItems.length} items)</h3>
        <ul>
          ${outOfStockItems.map(p => `
            <li><strong>${p.productName}</strong>: ${p.currentStock} units</li>
          `).join('')}
        </ul>
      `;
    }

    if (lowStockItems.length > 0) {
      alertHtml += `
        <h3 style="color: orange;">⚠ Low Stock (${lowStockItems.length} items)</h3>
        <ul>
          ${lowStockItems.map(p => `
            <li><strong>${p.productName}</strong>: ${p.currentStock} units remaining</li>
          `).join('')}
        </ul>
      `;
    }

    alertHtml += `
      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        Please take action to restock these items.
      </p>
    `;

    await this.emailQueue.add('email-job', {
      type: 'generic',
      data: {
        to: process.env.ADMIN_EMAIL,
        subject: `Inventory Alert: ${outOfStockItems.length} Out of Stock, ${lowStockItems.length} Low Stock`,
        html: alertHtml,
      },
    });
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
