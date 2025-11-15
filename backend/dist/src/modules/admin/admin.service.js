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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
let AdminService = AdminService_1 = class AdminService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AdminService_1.name);
    }
    async getDashboardStats() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [totalProducts, totalOrders, totalCustomers, totalRevenue, recentOrders, lowStockProducts, notificationStats, ordersLast30Days, ordersLast7Days,] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.order
                .findMany({ select: { customerEmail: true }, distinct: ['customerEmail'] })
                .then((orders) => orders.length),
            this.prisma.order.findMany({ select: { total: true, currency: true } }),
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    orderNumber: true,
                    customerName: true,
                    total: true,
                    currency: true,
                    status: true,
                    createdAt: true,
                },
            }),
            this.getProductsWithLowStock(),
            this.notificationService.getStats(),
            this.prisma.order.count({
                where: { createdAt: { gte: thirtyDaysAgo } },
            }),
            this.prisma.order.count({
                where: { createdAt: { gte: sevenDaysAgo } },
            }),
        ]);
        const revenue = { NGN: 0, USD: 0 };
        totalRevenue.forEach((order) => {
            revenue[order.currency] += Number(order.total);
        });
        return {
            overview: {
                totalProducts,
                totalOrders,
                totalCustomers,
                revenue,
                ordersLast30Days,
                ordersLast7Days,
            },
            recentOrders,
            lowStockProducts: lowStockProducts.slice(0, 5),
            notifications: notificationStats,
        };
    }
    async getAnalytics(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const orders = await this.prisma.order.findMany({
            where: { createdAt: { gte: startDate } },
            select: {
                createdAt: true,
                total: true,
                currency: true,
                status: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        const dailyStats = {};
        orders.forEach((order) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!dailyStats[date]) {
                dailyStats[date] = {
                    date,
                    orders: 0,
                    revenue: { NGN: 0, USD: 0 },
                    statuses: {},
                };
            }
            dailyStats[date].orders++;
            dailyStats[date].revenue[order.currency] += Number(order.total);
            dailyStats[date].statuses[order.status] =
                (dailyStats[date].statuses[order.status] || 0) + 1;
        });
        return {
            period: `${days} days`,
            dailyStats: Object.values(dailyStats),
            summary: {
                totalOrders: orders.length,
                totalRevenue: {
                    NGN: orders
                        .filter((o) => o.currency === 'NGN')
                        .reduce((sum, o) => sum + Number(o.total), 0),
                    USD: orders
                        .filter((o) => o.currency === 'USD')
                        .reduce((sum, o) => sum + Number(o.total), 0),
                },
                averageOrderValue: {
                    NGN: orders.filter((o) => o.currency === 'NGN').length > 0
                        ? orders
                            .filter((o) => o.currency === 'NGN')
                            .reduce((sum, o) => sum + Number(o.total), 0) /
                            orders.filter((o) => o.currency === 'NGN').length
                        : 0,
                    USD: orders.filter((o) => o.currency === 'USD').length > 0
                        ? orders
                            .filter((o) => o.currency === 'USD')
                            .reduce((sum, o) => sum + Number(o.total), 0) /
                            orders.filter((o) => o.currency === 'USD').length
                        : 0,
                },
            },
        };
    }
    async getTopProducts(limit = 10) {
        const orderItems = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            _count: {
                productId: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: limit,
        });
        const products = await Promise.all(orderItems.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    category: true,
                },
            });
            return {
                ...product,
                totalQuantitySold: item._sum.quantity,
                totalOrders: item._count.productId,
            };
        }));
        return products;
    }
    async getCustomerInsights() {
        const orders = await this.prisma.order.findMany({
            select: {
                customerEmail: true,
                total: true,
                currency: true,
                createdAt: true,
            },
        });
        const customerStats = {};
        orders.forEach((order) => {
            const email = order.customerEmail;
            if (!customerStats[email]) {
                customerStats[email] = {
                    email,
                    totalOrders: 0,
                    totalSpent: { NGN: 0, USD: 0 },
                    firstOrder: order.createdAt,
                    lastOrder: order.createdAt,
                };
            }
            customerStats[email].totalOrders++;
            customerStats[email].totalSpent[order.currency] += Number(order.total);
            if (order.createdAt > customerStats[email].lastOrder) {
                customerStats[email].lastOrder = order.createdAt;
            }
        });
        const customers = Object.values(customerStats).sort((a, b) => b.totalOrders - a.totalOrders);
        return {
            totalCustomers: customers.length,
            topCustomers: customers.slice(0, 10),
            repeatCustomers: customers.filter((c) => c.totalOrders > 1).length,
            repeatRate: customers.length > 0
                ? ((customers.filter((c) => c.totalOrders > 1).length /
                    customers.length) *
                    100).toFixed(2) + '%'
                : '0%',
        };
    }
    async broadcastNotification(dto) {
        let recipients = dto.recipients || [];
        if (recipients.length === 0 && dto.filter) {
            switch (dto.filter) {
                case 'all':
                    const allOrders = await this.prisma.order.findMany({
                        select: { customerEmail: true },
                        distinct: ['customerEmail'],
                    });
                    recipients = allOrders.map((o) => o.customerEmail);
                    break;
                case 'recent-customers':
                    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    const recentOrders = await this.prisma.order.findMany({
                        where: { createdAt: { gte: thirtyDaysAgo } },
                        select: { customerEmail: true },
                        distinct: ['customerEmail'],
                    });
                    recipients = recentOrders.map((o) => o.customerEmail);
                    break;
                case 'high-value':
                    const orders = await this.prisma.order.findMany({
                        select: { customerEmail: true, total: true },
                    });
                    const customerTotals = {};
                    orders.forEach((o) => {
                        if (!customerTotals[o.customerEmail]) {
                            customerTotals[o.customerEmail] = 0;
                        }
                        customerTotals[o.customerEmail] += Number(o.total);
                    });
                    recipients = Object.entries(customerTotals)
                        .filter(([, total]) => total >= 50000)
                        .map(([email]) => email);
                    break;
            }
        }
        const results = await Promise.allSettled(recipients.map((recipient) => this.notificationService.sendNotification({
            type: 'EMAIL',
            recipient,
            subject: dto.subject,
            message: dto.message,
            metadata: { broadcast: true, filter: dto.filter },
        })));
        const successful = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;
        this.logger.log(`Broadcast sent: ${successful} successful, ${failed} failed out of ${recipients.length}`);
        return {
            totalRecipients: recipients.length,
            successful,
            failed,
            recipients: recipients.slice(0, 10),
        };
    }
    async logActivity(data) {
        return this.prisma.activityLog.create({
            data: data,
        });
    }
    async getActivityLogs(query) {
        const { type, userId, userEmail, startDate, endDate, limit = 50, offset = 0, } = query;
        const where = {};
        if (type)
            where.type = type;
        if (userId)
            where.userId = userId;
        if (userEmail)
            where.userEmail = userEmail;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const logs = await this.prisma.activityLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
        const total = await this.prisma.activityLog.count({ where });
        return {
            logs,
            total,
            limit,
            offset,
        };
    }
    async getActivityStats() {
        const [totalActivities, todayActivities, byType, recentActivities,] = await Promise.all([
            this.prisma.activityLog.count(),
            this.prisma.activityLog.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            this.prisma.activityLog.groupBy({
                by: ['type'],
                _count: { type: true },
            }),
            this.prisma.activityLog.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            totalActivities,
            todayActivities,
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count.type;
                return acc;
            }, {}),
            recentActivities,
        };
    }
    async getProductsWithLowStock() {
        const products = await this.prisma.product.findMany({
            select: { id: true, name: true, slug: true, category: true },
        });
        const lowStockProducts = [];
        for (const product of products) {
            const events = await this.prisma.inventoryEvent.findMany({
                where: { productId: product.id },
                select: { delta: true },
            });
            const stock = events.reduce((total, event) => total + event.delta, 0);
            if (stock <= 10) {
                lowStockProducts.push({
                    ...product,
                    currentStock: stock,
                });
            }
        }
        return lowStockProducts.sort((a, b) => a.currentStock - b.currentStock);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], AdminService);
//# sourceMappingURL=admin.service.js.map