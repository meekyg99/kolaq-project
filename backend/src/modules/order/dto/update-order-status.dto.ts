import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

  @IsString()
  @IsOptional()
  paymentRef?: string;
}
