"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InventoryProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const prisma_service_1 = require("../../modules/prisma/prisma.service");
const bull_2 = require("@nestjs/bull");
const bullmq_2 = require("bullmq");
let InventoryProcessor = InventoryProcessor_1 = class InventoryProcessor {
    constructor(prisma, emailQueue) {
        this.prisma = prisma;
        this.emailQueue = emailQueue;
        this.logger = new common_1.Logger(InventoryProcessor_1.name);
    }
    async handleReconciliation(job) {
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
        }
        catch (error) {
            this.logger.error(`Inventory reconciliation job ${job.id} failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async handleLowStockCheck(job) {
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
        }
        catch (error) {
            this.logger.error(`Low stock check failed: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.InventoryProcessor = InventoryProcessor;
__decorate([
    (0, bull_1.Process)('reconcile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], InventoryProcessor.prototype, "handleReconciliation", null);
__decorate([
    (0, bull_1.Process)('low-stock-check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], InventoryProcessor.prototype, "handleLowStockCheck", null);
exports.InventoryProcessor = InventoryProcessor = InventoryProcessor_1 = __decorate([
    (0, bull_1.Processor)('inventory'),
    __param(1, (0, bull_2.InjectQueue)('emails')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], InventoryProcessor);
//# sourceMappingURL=inventory.processor.js.map