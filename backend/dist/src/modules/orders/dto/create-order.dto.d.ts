import { Currency } from '@prisma/client';
declare class OrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    shippingAddress: string;
    currency: Currency;
    subtotal: number;
    shippingCost?: number;
    total: number;
    items: OrderItemDto[];
    paymentMethod?: string;
    paymentRef?: string;
    notes?: string;
}
export {};
