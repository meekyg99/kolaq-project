import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { LogisticsService } from '../logistics/logistics.service';
import { NotificationService } from '../notification/notification.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
    private logisticsService: LogisticsService,
    private notificationService: NotificationService,
  ) {}

  async create(data: CreateOrderDto) {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        shippingState: data.shippingState,
        shippingLGA: data.shippingLGA,
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
        statusHistory: {
          create: {
            status: 'PENDING',
            note: 'Order created',
            createdBy: 'SYSTEM',
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        statusHistory: true,
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

  async findAll(filters?: {
    status?: OrderStatus;
    customerEmail?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.customerEmail) where.customerEmail = { contains: filters.customerEmail, mode: 'insensitive' };
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
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

  async findOne(id: string) {
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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
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
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateDto: UpdateOrderStatusDto, userId?: string, userEmail?: string) {
    const order = await this.findOne(id);

    // Use transaction to update order and create status history
    const updated = await this.prisma.$transaction(async (tx) => {
      // Update order
      const updatedOrder = await tx.order.update({
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
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      // Create status history entry if status changed
      if (updateDto.status && updateDto.status !== order.status) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: updateDto.status,
            note: updateDto.notes,
            createdBy: userId || 'SYSTEM',
          },
        });
      }

      return updatedOrder;
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

  async trackOrder(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }

    return order;
  }

  async getOrderStats() {
    const [total, pending, paid, processing, dispatched, delivered, cancelled] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'PAID' } }),
      this.prisma.order.count({ where: { status: 'PROCESSING' } }),
      this.prisma.order.count({ where: { status: 'DISPATCHED' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      total,
      byStatus: {
        pending,
        paid,
        processing,
        dispatched,
        delivered,
        cancelled,
      },
    };
  }

  /**
   * Create shipment when order is ready for dispatch
   */
  async createShipmentForOrder(orderId: string, userId?: string) {
    const order = await this.findOne(orderId);

    if (order.status !== 'READY_FOR_DISPATCH' && order.status !== 'PROCESSING') {
      throw new Error('Order must be in READY_FOR_DISPATCH or PROCESSING status');
    }

    if (order.trackingNumber) {
      throw new Error('Shipment already created for this order');
    }

    try {
      // Calculate total weight (assume 1kg per item for now)
      const totalWeight = order.items.reduce((sum, item) => sum + item.quantity, 0);

      // Get business details from env
      const senderName = process.env.BUSINESS_NAME || 'KOLAQ ALAGBO BITTERS';
      const senderPhone = process.env.BUSINESS_PHONE || '08157065742';
      const senderAddress = process.env.BUSINESS_ADDRESS || 'Lagos, Nigeria';
      const senderState = process.env.BUSINESS_STATE || 'Lagos';
      const senderLGA = process.env.BUSINESS_LGA || 'Ikeja';

      // Create shipment with GIG Logistics
      const shipment = await this.logisticsService.createShipment({
        senderName,
        senderPhone,
        senderAddress,
        senderState,
        senderLGA,
        receiverName: order.customerName,
        receiverPhone: order.customerPhone || '',
        receiverAddress: order.shippingAddress,
        receiverState: order.shippingState || 'Lagos',
        receiverLGA: order.shippingLGA || '',
        itemName: `Order ${order.orderNumber}`,
        itemValue: Number(order.total),
        itemWeight: totalWeight,
        itemQuantity: order.items.length,
        deliveryType: 'STANDARD',
        paymentMethod: 'PREPAID',
      });

      if (shipment.success) {
        // Update order with tracking information
        const updated = await this.prisma.$transaction(async (tx) => {
          const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: {
              trackingNumber: shipment.waybillNumber,
              trackingUrl: `https://giglogistics.com/track/${shipment.waybillNumber}`,
              carrier: 'GIG Logistics',
              estimatedDelivery: new Date(shipment.estimatedDeliveryDate),
              status: 'DISPATCHED',
            },
            include: {
              items: {
                include: { product: true },
              },
              statusHistory: true,
            },
          });

          // Create status history entry
          await tx.orderStatusHistory.create({
            data: {
              orderId,
              status: 'DISPATCHED',
              note: `Shipment created with tracking number: ${shipment.waybillNumber}`,
              createdBy: userId || 'SYSTEM',
            },
          });

          return updatedOrder;
        });

        // Send dispatch notification
        await this.notificationService.sendOrderDispatchedNotification(updated);

        await this.activityService.log({
          type: 'ORDER_STATUS_UPDATED',
          userId,
          action: 'Shipment created',
          description: `Shipment created for order ${order.orderNumber} with tracking ${shipment.waybillNumber}`,
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            trackingNumber: shipment.waybillNumber,
            carrier: 'GIG Logistics',
          },
        });

        return updated;
      }

      throw new Error('Failed to create shipment');
    } catch (error) {
      this.logger.error(`Failed to create shipment for order ${orderId}`, error);
      throw error;
    }
  }

  /**
   * Track shipment and update order status
   */
  async syncShipmentStatus(orderId: string) {
    const order = await this.findOne(orderId);

    if (!order.trackingNumber) {
      throw new Error('No tracking number found for this order');
    }

    try {
      const tracking = await this.logisticsService.trackShipment(order.trackingNumber);

      if (tracking.success) {
        // Map logistics status to order status
        let orderStatus: OrderStatus = order.status;
        let statusNote = tracking.statusHistory[tracking.statusHistory.length - 1]?.remarks || '';

        if (tracking.status === 'DELIVERED') {
          orderStatus = 'DELIVERED';
        } else if (tracking.status === 'OUT_FOR_DELIVERY') {
          orderStatus = 'OUT_FOR_DELIVERY';
        } else if (tracking.status === 'IN_TRANSIT') {
          orderStatus = 'IN_TRANSIT';
        }

        // Update order if status changed
        if (orderStatus !== order.status) {
          await this.updateStatus(
            orderId,
            {
              status: orderStatus,
              notes: statusNote,
            },
            undefined,
            'SYSTEM',
          );
        }

        return tracking;
      }

      throw new Error('Failed to track shipment');
    } catch (error) {
      this.logger.error(`Failed to sync shipment status for order ${orderId}`, error);
      throw error;
    }
  }

  /**
   * Batch sync all active shipments
   */
  async syncAllActiveShipments() {
    const activeOrders = await this.prisma.order.findMany({
      where: {
        status: {
          in: ['DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'],
        },
        trackingNumber: {
          not: null,
        },
      },
      select: {
        id: true,
        orderNumber: true,
        trackingNumber: true,
      },
    });

    this.logger.log(`Syncing ${activeOrders.length} active shipments`);

    const results = await Promise.allSettled(
      activeOrders.map((order) => this.syncShipmentStatus(order.id)),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(`Sync complete: ${successful} successful, ${failed} failed`);

    return {
      total: activeOrders.length,
      successful,
      failed,
      results,
    };
  }
}
