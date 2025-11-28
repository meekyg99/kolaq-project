import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    private activityService;
    constructor(prisma: PrismaService, activityService: ActivityService);
    create(data: CreateOrderDto): Promise<{
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
    findAll(filters?: {
        status?: OrderStatus;
        customerEmail?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        orders: ({
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    findByOrderNumber(orderNumber: string): Promise<{
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
    updateStatus(id: string, updateDto: UpdateOrderStatusDto, userId?: string, userEmail?: string): Promise<{
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
    getOrderStats(): Promise<{
        total: number;
        byStatus: {
            pending: number;
            paid: number;
            processing: number;
            shipped: number;
            delivered: number;
            cancelled: number;
        };
    }>;
}
