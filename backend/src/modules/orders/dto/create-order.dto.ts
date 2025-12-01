import { IsString, IsEmail, IsArray, IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from '@prisma/client';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  customerEmail: string;

  @IsString()
  customerName: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  shippingAddress: string;

  @IsString()
  @IsOptional()
  shippingState?: string;

  @IsString()
  @IsOptional()
  shippingLGA?: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  paymentRef?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
