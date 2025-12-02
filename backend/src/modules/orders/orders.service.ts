import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
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
}
