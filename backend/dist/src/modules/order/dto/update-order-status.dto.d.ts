export declare class UpdateOrderStatusDto {
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
    paymentRef?: string;
}
