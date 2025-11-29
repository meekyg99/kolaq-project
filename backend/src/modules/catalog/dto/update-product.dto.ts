import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsNumber, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class PriceDto {
  @IsString()
  @IsOptional()
  currency?: 'NGN' | 'USD';

  @IsOptional()
  amount?: number;
}

class VariantDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  bottleSize: string;

  @IsNumber()
  priceNGN: number;

  @IsNumber()
  priceUSD: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  category?: string;

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
  @IsOptional()
  prices?: PriceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @IsOptional()
  variants?: VariantDto[];
}
