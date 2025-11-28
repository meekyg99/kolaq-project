import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class PriceDto {
  @IsString()
  @IsOptional()
  currency?: 'NGN' | 'USD';

  @IsOptional()
  amount?: number;
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
}
