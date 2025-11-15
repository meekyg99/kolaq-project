import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';
import { SendNotificationDto } from './dto/send-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { orderConfirmationTemplate } from './templates/order-confirmation.template';
import { orderStatusUpdateTemplate } from './templates/order-status-update.template';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private resend: Resend | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.logger.log('Resend email service initialized');
    } else {
      this.logger.warn('Resend API key not configured - email notifications disabled');
    }
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
    if (!this.resend) {
      this.logger.warn('Email notification skipped - Resend not configured');
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'FAILED',
          error: 'Resend API key not configured',
        },
      });
      return;
    }

    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL', 'noreply@kolaqbitters.com');
      
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: dto.recipient,
        subject: dto.subject || 'Notification from KOLAQ Bitters',
        html: dto.message,
      });

      await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          metadata: { ...dto.metadata, emailId: result.data?.id },
        },
      });

      this.logger.log(`Email sent to ${dto.recipient}`);
    } catch (error) {
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
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const statusMessages = {
      PAID: 'Your payment has been confirmed and your order is being processed.',
      PROCESSING: 'Your order is being prepared for shipment.',
      SHIPPED: 'Your order has been shipped and is on its way to you!',
      DELIVERED: 'Your order has been delivered. We hope you enjoy your purchase!',
      CANCELLED: 'Your order has been cancelled. If you have any questions, please contact us.',
    };

    const html = orderStatusUpdateTemplate({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      status,
      statusMessage: customMessage || statusMessages[status] || 'Your order status has been updated.',
    });

    return this.sendNotification({
      type: 'EMAIL',
      recipient: order.customerEmail,
      subject: `Order Update - ${order.orderNumber}`,
      message: html,
      metadata: { orderId, orderNumber: order.orderNumber, status },
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
