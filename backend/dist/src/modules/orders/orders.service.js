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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_service_1 = require("../activity/activity.service");
let OrdersService = class OrdersService {
    constructor(prisma, activityService) {
        this.prisma = prisma;
        this.activityService = activityService;
    }
    async create(data) {
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                shippingAddress: data.shippingAddress,
                currency: data.currency,
                subtotal: data.subtotal,
                shippingCost: data.shippingCost || 0,
                total: data.total,
                paymentMethod: data.paymentMethod,
                paymentRef: data.paymentRef,
                notes: data.notes,
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        currency: data.currency,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        await this.activityService.log({
            type: 'ORDER_STATUS_UPDATED',
            action: 'Order created',
            description: `Order ${orderNumber} created for ${data.customerEmail}`,
            metadata: { orderId: order.id, orderNumber },
        });
        return order;
    }
    async findAll(filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.customerEmail)
            where.customerEmail = { contains: filters.customerEmail, mode: 'insensitive' };
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderNumber} not found`);
        }
        return order;
    }
    async updateStatus(id, updateDto, userId, userEmail) {
        const order = await this.findOne(id);
        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                status: updateDto.status,
                paymentStatus: updateDto.paymentStatus,
                notes: updateDto.notes || order.notes,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        await this.activityService.log({
            type: 'ORDER_STATUS_UPDATED',
            userId,
            userEmail,
            action: 'Order status updated',
            description: `Order ${order.orderNumber} status changed to ${updateDto.status || updateDto.paymentStatus}`,
            metadata: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                oldStatus: order.status,
                newStatus: updateDto.status,
                oldPaymentStatus: order.paymentStatus,
                newPaymentStatus: updateDto.paymentStatus,
            },
        });
        return updated;
    }
    async getOrderStats() {
        const [total, pending, paid, processing, shipped, delivered, cancelled] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'PENDING' } }),
            this.prisma.order.count({ where: { status: 'PAID' } }),
            this.prisma.order.count({ where: { status: 'PROCESSING' } }),
            this.prisma.order.count({ where: { status: 'SHIPPED' } }),
            this.prisma.order.count({ where: { status: 'DELIVERED' } }),
            this.prisma.order.count({ where: { status: 'CANCELLED' } }),
        ]);
        return {
            total,
            byStatus: {
                pending,
                paid,
                processing,
                shipped,
                delivered,
                cancelled,
            },
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_service_1.ActivityService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map