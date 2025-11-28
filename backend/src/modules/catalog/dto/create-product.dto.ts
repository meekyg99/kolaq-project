import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateNested, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class PriceDto {
  @IsString()
  @IsNotEmpty()
  currency: 'NGN' | 'USD';

  @IsNotEmpty()
  amount: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  // Promo fields
  @IsBoolean()
  @IsOptional()
  isPromo?: boolean;

  @IsNumber()
  @IsOptional()
  promoPrice?: number;

  @IsDateString()
  @IsOptional()
  promoStartDate?: string;

  @IsDateString()
  @IsOptional()
  promoEndDate?: string;

  @IsString()
  @IsOptional()
  promoLabel?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceDto)
  prices: PriceDto[];
}

