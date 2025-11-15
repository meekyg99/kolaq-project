declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    shippingAddress: string;
    currency: 'NGN' | 'USD';
    items: OrderItemDto[];
    notes?: string;
    sessionId?: string;
}
export {};
