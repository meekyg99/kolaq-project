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
                id: string;
                name: string;
                slug: string;
                image: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        currency: import(".prisma/client").$Enums.Currency;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    findAll(query: QueryOrderDto): Promise<{
        orders: ({
            items: ({
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    image: string;
                };
            } & {
                id: string;
                createdAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                currency: import(".prisma/client").$Enums.Currency;
                productId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            currency: import(".prisma/client").$Enums.Currency;
            customerEmail: string;
            customerName: string;
            customerPhone: string | null;
            shippingAddress: string;
            notes: string | null;
            paymentRef: string | null;
            orderNumber: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
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
                id: string;
                name: string;
                slug: string;
                image: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        currency: import(".prisma/client").$Enums.Currency;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    findByOrderNumber(orderNumber: string): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                slug: string;
                image: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        currency: import(".prisma/client").$Enums.Currency;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string;
                image: string | null;
                category: string;
                size: string | null;
                isFeatured: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: import(".prisma/client").$Enums.Currency;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        currency: import(".prisma/client").$Enums.Currency;
        customerEmail: string;
        customerName: string;
        customerPhone: string | null;
        shippingAddress: string;
        notes: string | null;
        paymentRef: string | null;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
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
