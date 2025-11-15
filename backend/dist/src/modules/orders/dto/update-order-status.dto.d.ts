import { OrderStatus, PaymentStatus } from '@prisma/client';
export declare class UpdateOrderStatusDto {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    notes?: string;
}
