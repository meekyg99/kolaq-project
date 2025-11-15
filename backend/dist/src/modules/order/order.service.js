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
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrderService = OrderService_1 = class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrderService_1.name);
    }
    setNotificationService(notificationService) {
        this.notificationService = notificationService;
    }
    async createOrder(createOrderDto) {
        const { items, sessionId, ...orderData } = createOrderDto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
                include: { prices: true },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID '${item.productId}' not found`);
            }
            const price = product.prices.find((p) => p.currency === orderData.currency);
            if (!price) {
                throw new common_1.BadRequestException(`Product ${product.name} not available in ${orderData.currency}`);
            }
            const itemTotal = Number(price.amount) * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price.amount,
                currency: orderData.currency,
            });
        }
        const shippingCost = 0;
        const total = subtotal + shippingCost;
        const orderNumber = this.generateOrderNumber();
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                ...orderData,
                subtotal,
                shippingCost,
                total,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });
        if (sessionId) {
            await this.prisma.cart.deleteMany({
                where: { sessionId },
            });
            this.logger.log(`Cleared cart after order creation: ${sessionId}`);
        }
        this.logger.log(`Created order ${order.orderNumber} for ${order.customerEmail}`);
        if (this.notificationService) {
            this.notificationService
                .sendOrderConfirmation(order.id)
                .catch((error) => {
                this.logger.error(`Failed to send order confirmation: ${error.message}`);
            });
        }
        return order;
    }
    async findAll(query) {
        const { status, customerEmail, limit = 50, offset = 0 } = query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (customerEmail) {
            where.customerEmail = customerEmail;
        }
        const orders = await this.prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
        const total = await this.prisma.order.count({ where });
        return {
            orders,
            total,
            limit,
            offset,
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID '${id}' not found`);
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with number '${orderNumber}' not found`);
        }
        return order;
    }
    async updateStatus(id, updateDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID '${id}' not found`);
        }
        const updateData = {
            status: updateDto.status,
        };
        if (updateDto.status === 'PAID' && updateDto.paymentRef) {
            updateData.paymentStatus = 'COMPLETED';
            updateData.paymentRef = updateDto.paymentRef;
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        this.logger.log(`Updated order ${order.orderNumber} status: ${order.status} -> ${updateDto.status}`);
        if (this.notificationService && updateDto.status !== 'PENDING') {
            this.notificationService
                .sendOrderStatusUpdate(order.id, updateDto.status)
                .catch((error) => {
                this.logger.error(`Failed to send status update: ${error.message}`);
            });
        }
        return updatedOrder;
    }
    generateOrderNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }
    async getOrderStats() {
        const [totalOrders, pendingOrders, paidOrders, processingOrders, shippedOrders, deliveredOrders,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'PENDING' } }),
            this.prisma.order.count({ where: { status: 'PAID' } }),
            this.prisma.order.count({ where: { status: 'PROCESSING' } }),
            this.prisma.order.count({ where: { status: 'SHIPPED' } }),
            this.prisma.order.count({ where: { status: 'DELIVERED' } }),
        ]);
        const orders = await this.prisma.order.findMany({
            select: { total: true, currency: true },
        });
        const totalRevenue = {
            NGN: 0,
            USD: 0,
        };
        orders.forEach((order) => {
            totalRevenue[order.currency] += Number(order.total);
        });
        return {
            totalOrders,
            pendingOrders,
            paidOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            totalRevenue,
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map