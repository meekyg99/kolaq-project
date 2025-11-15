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
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = InventoryService_1 = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(InventoryService_1.name);
        this.LOW_STOCK_THRESHOLD = 10;
    }
    async adjustInventory(adjustInventoryDto) {
        const { productId, delta, reason, actorEmail } = adjustInventoryDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${productId}' not found`);
        }
        const currentStock = await this.getCurrentStock(productId);
        if (currentStock + delta < 0) {
            throw new common_1.BadRequestException(`Insufficient stock. Current: ${currentStock}, Requested: ${delta}`);
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
        this.logger.log(`Inventory adjusted for ${product.name}: ${currentStock} -> ${newStock} (${delta > 0 ? '+' : ''}${delta})`);
        if (newStock <= this.LOW_STOCK_THRESHOLD && delta < 0) {
            this.logger.warn(`Low stock alert for ${product.name}: ${newStock} units remaining`);
        }
        return {
            event,
            previousStock: currentStock,
            newStock,
            lowStockAlert: newStock <= this.LOW_STOCK_THRESHOLD,
        };
    }
    async getCurrentStock(productId) {
        const events = await this.prisma.inventoryEvent.findMany({
            where: { productId },
            select: { delta: true },
        });
        return events.reduce((total, event) => total + event.delta, 0);
    }
    async getInventoryHistory(query) {
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
    async getProductInventory(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${productId}' not found`);
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
            }
            else if (stock <= this.LOW_STOCK_THRESHOLD) {
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map