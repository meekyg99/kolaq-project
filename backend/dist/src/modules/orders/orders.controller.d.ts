import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
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
            quantity: number;
            orderId: string;
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
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    findAll(status?: OrderStatus, customerEmail?: string, startDate?: string, endDate?: string, page?: string, limit?: string): Promise<{
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
                quantity: number;
                orderId: string;
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
    getStats(): Promise<{
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
            quantity: number;
            orderId: string;
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
            quantity: number;
            orderId: string;
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
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto, req: any): Promise<{
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
            quantity: number;
            orderId: string;
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
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingCost: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
    }>;
}
