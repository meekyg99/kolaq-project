import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrderDto } from './dto/query-order.dto';
export declare class OrderService {
    private readonly prisma;
    private readonly logger;
    private notificationService;
    constructor(prisma: PrismaService);
    setNotificationService(notificationService: any): void;
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        items: ({
            product: {
                slug: string;
                name: string;
                image: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        trackingNumber: string | null;
        trackingUrl: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    findAll(query: QueryOrderDto): Promise<{
        orders: ({
            items: ({
                product: {
                    slug: string;
                    name: string;
                    image: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                currency: import(".prisma/client").$Enums.Currency;
                productId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                orderId: string;
                quantity: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: import("@prisma/client/runtime/library").Decimal;
            customerEmail: string;
            customerName: string;
            customerPhone: string | null;
            shippingAddress: string;
            notes: string | null;
            paymentRef: string | null;
            trackingNumber: string | null;
            trackingUrl: string | null;
            orderNumber: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: string | null;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findOne(id: string): Promise<{
        items: ({
            product: {
                slug: string;
                name: string;
                image: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        trackingNumber: string | null;
        trackingUrl: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    findByOrderNumber(orderNumber: string): Promise<{
        items: ({
            product: {
                slug: string;
                name: string;
                image: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        trackingNumber: string | null;
        trackingUrl: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<{
        items: ({
            product: {
                slug: string;
                name: string;
                description: string;
                image: string | null;
                category: string;
                size: string | null;
                isFeatured: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: import(".prisma/client").$Enums.Currency;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        trackingNumber: string | null;
        trackingUrl: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    private generateOrderNumber;
    getOrderStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        paidOrders: number;
        processingOrders: number;
        shippedOrders: number;
        deliveredOrders: number;
        totalRevenue: {
            NGN: number;
            USD: number;
        };
    }>;
}
