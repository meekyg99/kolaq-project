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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("./email/email.service");
const templates_1 = require("./templates");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationService_1.name);
        this.emailService = new email_service_1.EmailFacadeService(configService);
    }
    async sendNotification(dto) {
        const notification = await this.prisma.notification.create({
            data: {
                type: dto.type,
                recipient: dto.recipient,
                subject: dto.subject,
                message: dto.message,
                metadata: dto.metadata || {},
                status: 'PENDING',
            },
        });
        try {
            switch (dto.type) {
                case 'EMAIL':
                    await this.sendEmail(notification.id, dto);
                    break;
                case 'SMS':
                    await this.sendSMS(notification.id, dto);
                    break;
                case 'WHATSAPP':
                    await this.sendWhatsApp(notification.id, dto);
                    break;
            }
            return notification;
        }
        catch (error) {
            this.logger.error(`Failed to send notification: ${error.message}`);
            await this.prisma.notification.update({
                where: { id: notification.id },
                data: {
                    status: 'FAILED',
                    error: error.message,
                },
            });
            throw error;
        }
    }
    async sendEmail(notificationId, dto) {
        try {
            const result = await this.emailService.sendRawEmail({
                to: dto.recipient,
                subject: dto.subject || 'Notification from KOLAQ ALAGBO',
                html: dto.message,
            });
            if (result.success) {
                await this.prisma.notification.update({
                    where: { id: notificationId },
                    data: {
                        status: 'SENT',
                        sentAt: new Date(),
                        metadata: { ...dto.metadata, emailId: result.messageId, provider: result.provider },
                    },
                });
                this.logger.log(`Email sent to ${dto.recipient} via ${result.provider}`);
            }
            else {
                throw new Error(result.error || 'Failed to send email');
            }
        }
        catch (error) {
            await this.prisma.notification.update({
                where: { id: notificationId },
                data: {
                    status: 'FAILED',
                    error: error.message,
                },
            });
            throw error;
        }
    }
    async sendSMS(notificationId, dto) {
        this.logger.warn('SMS notifications not yet implemented');
        await this.prisma.notification.update({
            where: { id: notificationId },
            data: {
                status: 'FAILED',
                error: 'SMS service not configured',
            },
        });
    }
    async sendWhatsApp(notificationId, dto) {
        this.logger.warn('WhatsApp notifications not yet implemented');
        await this.prisma.notification.update({
            where: { id: notificationId },
            data: {
                status: 'FAILED',
                error: 'WhatsApp service not configured',
            },
        });
    }
    async sendOrderConfirmation(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }
        const items = order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
        }));
        const html = (0, templates_1.orderConfirmationTemplate)({
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            items,
            subtotal: Number(order.subtotal),
            shippingCost: Number(order.shippingCost),
            total: Number(order.total),
            currency: order.currency,
            shippingAddress: order.shippingAddress,
        });
        return this.sendNotification({
            type: 'EMAIL',
            recipient: order.customerEmail,
            subject: `Order Confirmation - ${order.orderNumber}`,
            message: html,
            metadata: { orderId, orderNumber: order.orderNumber },
        });
    }
    async sendOrderStatusUpdate(orderId, status, customMessage, trackingInfo) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }
        let html;
        let subject;
        switch (status.toUpperCase()) {
            case 'PROCESSING':
            case 'PAID':
                html = (0, templates_1.orderProcessingTemplate)({
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    message: 'Your order is being prepared and will ship within 1-2 business days.',
                });
                subject = `Your Order is Being Prepared - ${order.orderNumber}`;
                break;
            case 'SHIPPED':
                html = (0, templates_1.orderShippedTemplate)({
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    trackingNumber: trackingInfo?.trackingNumber,
                    trackingUrl: trackingInfo?.trackingUrl,
                    estimatedDelivery: trackingInfo?.estimatedDelivery,
                    carrier: trackingInfo?.carrier,
                });
                subject = `Your Order Has Been Shipped - ${order.orderNumber}`;
                break;
            case 'DELIVERED':
                html = (0, templates_1.orderDeliveredTemplate)({
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                });
                subject = `Your Order Has Been Delivered - ${order.orderNumber}`;
                break;
            default:
                html = (0, templates_1.orderProcessingTemplate)({
                    customerName: order.customerName,
                    orderNumber: order.orderNumber,
                    message: customMessage || 'Your order status has been updated.',
                });
                subject = `Order Update - ${order.orderNumber}`;
        }
        return this.sendNotification({
            type: 'EMAIL',
            recipient: order.customerEmail,
            subject,
            message: html,
            metadata: { orderId, orderNumber: order.orderNumber, status },
        });
    }
    async sendWelcomeEmail(email, name) {
        const html = (0, templates_1.welcomeEmailTemplate)({
            customerName: name,
        });
        return this.sendNotification({
            type: 'EMAIL',
            recipient: email,
            subject: 'Welcome to KOLAQ ALAGBO! 🌿',
            message: html,
            metadata: { type: 'welcome' },
        });
    }
    async sendPasswordResetEmail(email, name, resetUrl) {
        const html = (0, templates_1.passwordResetTemplate)({
            customerName: name,
            resetUrl,
        });
        return this.sendNotification({
            type: 'EMAIL',
            recipient: email,
            subject: 'Reset Your KOLAQ ALAGBO Password',
            message: html,
            metadata: { type: 'password-reset' },
        });
    }
    async sendLowStockAlert(adminEmail, products) {
        const html = (0, templates_1.lowStockAlertTemplate)({ products });
        return this.sendNotification({
            type: 'EMAIL',
            recipient: adminEmail,
            subject: `⚠️ Low Stock Alert: ${products.length} product(s) need attention`,
            message: html,
            metadata: { type: 'low-stock-alert', productCount: products.length },
        });
    }
    async findAll(query) {
        const { type, status, recipient, limit = 50, offset = 0 } = query;
        const where = {};
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (recipient)
            where.recipient = recipient;
        const notifications = await this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
        const total = await this.prisma.notification.count({ where });
        return {
            notifications,
            total,
            limit,
            offset,
        };
    }
    async getStats() {
        const [totalNotifications, sentNotifications, failedNotifications, pendingNotifications, emailNotifications, smsNotifications, whatsappNotifications,] = await Promise.all([
            this.prisma.notification.count(),
            this.prisma.notification.count({ where: { status: 'SENT' } }),
            this.prisma.notification.count({ where: { status: 'FAILED' } }),
            this.prisma.notification.count({ where: { status: 'PENDING' } }),
            this.prisma.notification.count({ where: { type: 'EMAIL' } }),
            this.prisma.notification.count({ where: { type: 'SMS' } }),
            this.prisma.notification.count({ where: { type: 'WHATSAPP' } }),
        ]);
        return {
            totalNotifications,
            sentNotifications,
            failedNotifications,
            pendingNotifications,
            byType: {
                email: emailNotifications,
                sms: smsNotifications,
                whatsapp: whatsappNotifications,
            },
            successRate: totalNotifications > 0
                ? ((sentNotifications / totalNotifications) * 100).toFixed(2) + '%'
                : '0%',
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map