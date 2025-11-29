import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { EmailFacadeService } from './email/email.service';
import {
  orderConfirmationTemplate,
  orderProcessingTemplate,
  orderShippedTemplate,
  orderDeliveredTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
  lowStockAlertTemplate,
} from './templates';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private emailService: EmailFacadeService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.emailService = new EmailFacadeService(configService);
  }

  async sendNotification(dto: SendNotificationDto) {
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
    } catch (error) {
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

  private async sendEmail(notificationId: string, dto: SendNotificationDto) {
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
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
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

  private async sendSMS(notificationId: string, dto: SendNotificationDto) {
    // TODO: Integrate Twilio or other SMS provider
    this.logger.warn('SMS notifications not yet implemented');
    
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'FAILED',
        error: 'SMS service not configured',
      },
    });
  }

  private async sendWhatsApp(notificationId: string, dto: SendNotificationDto) {
    // TODO: Integrate WhatsApp Business API
    this.logger.warn('WhatsApp notifications not yet implemented');
    
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'FAILED',
        error: 'WhatsApp service not configured',
      },
    });
  }

  async sendOrderConfirmation(orderId: string) {
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

    const html = orderConfirmationTemplate({
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

  async sendOrderStatusUpdate(
    orderId: string,
    status: string,
    customMessage?: string,
    trackingInfo?: { trackingNumber?: string; trackingUrl?: string; carrier?: string; estimatedDelivery?: string },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Parse shipping address
    let shippingAddress = { street: '', city: '', state: '', country: '' };
    try {
      if (typeof order.shippingAddress === 'string') {
        shippingAddress = JSON.parse(order.shippingAddress);
      }
    } catch {
      shippingAddress = { street: order.shippingAddress || '', city: '', state: '', country: '' };
    }

    let html: string;
    let subject: string;

    switch (status.toUpperCase()) {
      case 'PROCESSING':
      case 'PAID':
        html = orderProcessingTemplate({
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          message: 'Your order is being prepared and will ship within 1-2 business days.',
        });
        subject = `Your Order is Being Prepared - ${order.orderNumber}`;
        break;

      case 'SHIPPED':
        html = orderShippedTemplate({
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          trackingNumber: trackingInfo?.trackingNumber,
          trackingUrl: trackingInfo?.trackingUrl,
          estimatedDelivery: trackingInfo?.estimatedDelivery ? new Date(trackingInfo.estimatedDelivery) : undefined,
          carrier: trackingInfo?.carrier,
          shippingAddress,
        });
        subject = `Your Order Has Been Shipped - ${order.orderNumber}`;
        break;

      case 'DELIVERED':
        html = orderDeliveredTemplate({
          customerName: order.customerName,
          orderNumber: order.orderNumber,
        });
        subject = `Your Order Has Been Delivered - ${order.orderNumber}`;
        break;

      default:
        // Fallback for other statuses
        html = orderProcessingTemplate({
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

  async sendWelcomeEmail(email: string, name: string) {
    const html = welcomeEmailTemplate({
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

  async sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
    const html = passwordResetTemplate({
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

  async sendLowStockAlert(
    adminEmail: string,
    products: Array<{ name: string; currentStock: number; threshold: number; sku?: string }>,
  ) {
    const html = lowStockAlertTemplate({ products });

    return this.sendNotification({
      type: 'EMAIL',
      recipient: adminEmail,
      subject: `⚠️ Low Stock Alert: ${products.length} product(s) need attention`,
      message: html,
      metadata: { type: 'low-stock-alert', productCount: products.length },
    });
  }

  async findAll(query: QueryNotificationDto) {
    const { type, status, recipient, limit = 50, offset = 0 } = query;

    const where: any = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (recipient) where.recipient = recipient;

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
    const [
      totalNotifications,
      sentNotifications,
      failedNotifications,
      pendingNotifications,
      emailNotifications,
      smsNotifications,
      whatsappNotifications,
    ] = await Promise.all([
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
}
