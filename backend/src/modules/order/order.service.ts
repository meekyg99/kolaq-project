import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrderDto } from './dto/query-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private notificationService: any; // Will be injected if available

  constructor(private readonly prisma: PrismaService) {}

  setNotificationService(notificationService: any) {
    this.notificationService = notificationService;
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { items, sessionId, ...orderData } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { prices: true },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID '${item.productId}' not found`,
        );
      }

      const price = product.prices.find(
        (p) => p.currency === orderData.currency,
      );

      if (!price) {
        throw new BadRequestException(
          `Product ${product.name} not available in ${orderData.currency}`,
        );
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

    const shippingCost = 0; // TODO: Calculate shipping based on location
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

    this.logger.log(
      `Created order ${order.orderNumber} for ${order.customerEmail}`,
    );

    // Send order confirmation email (async, don't wait)
    if (this.notificationService) {
      this.notificationService
        .sendOrderConfirmation(order.id)
        .catch((error) => {
          this.logger.error(`Failed to send order confirmation: ${error.message}`);
        });
    }

    return order;
  }

  async findAll(query: QueryOrderDto) {
    const { status, customerEmail, limit = 50, offset = 0 } = query;

    const where: any = {};

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

    // Transform orders to include user info and proper structure for admin panel
    const transformedOrders = orders.map(order => {
      // Parse shipping address if it's a JSON string
      let shippingAddress = order.shippingAddress;
      try {
        if (typeof order.shippingAddress === 'string') {
          shippingAddress = JSON.parse(order.shippingAddress);
        }
      } catch {
        // If parsing fails, create a basic structure
        shippingAddress = {
          street: order.shippingAddress,
          city: '',
          state: '',
          country: '',
        };
      }

      return {
        ...order,
        user: {
          name: order.customerName,
          email: order.customerEmail,
        },
        shippingAddress,
        totalNGN: order.currency === 'NGN' ? Number(order.total) : 0,
        totalUSD: order.currency === 'USD' ? Number(order.total) : 0,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          priceNGN: item.currency === 'NGN' ? Number(item.price) : 0,
          priceUSD: item.currency === 'USD' ? Number(item.price) : 0,
          image: item.product?.image,
        })),
      };
    });

    return {
      orders: transformedOrders,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
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
      throw new NotFoundException(
        `Order with number '${orderNumber}' not found`,
      );
    }

    return order;
  }

  async updateStatus(id: string, updateDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    const updateData: any = {
      status: updateDto.status,
    };

    if (updateDto.status === 'PAID' && updateDto.paymentRef) {
      updateData.paymentStatus = 'COMPLETED';
      updateData.paymentRef = updateDto.paymentRef;
    }

    // Store tracking info if provided
    if (updateDto.trackingNumber) {
      updateData.trackingNumber = updateDto.trackingNumber;
    }
    if (updateDto.trackingUrl) {
      updateData.trackingUrl = updateDto.trackingUrl;
    }
    if (updateDto.carrier) {
      updateData.carrier = updateDto.carrier;
    }
    if (updateDto.estimatedDelivery) {
      updateData.estimatedDelivery = new Date(updateDto.estimatedDelivery);
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

    this.logger.log(
      `Updated order ${order.orderNumber} status: ${order.status} -> ${updateDto.status}`,
    );

    // Send status update email (async, don't wait)
    if (this.notificationService && updateDto.status !== 'PENDING') {
      const trackingInfo = {
        trackingNumber: updateDto.trackingNumber,
        trackingUrl: updateDto.trackingUrl,
        carrier: updateDto.carrier,
        estimatedDelivery: updateDto.estimatedDelivery,
      };
      this.notificationService
        .sendOrderStatusUpdate(order.id, updateDto.status, undefined, trackingInfo)
        .catch((error) => {
          this.logger.error(`Failed to send status update: ${error.message}`);
        });
    }

    return updatedOrder;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
    ] = await Promise.all([
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
}
