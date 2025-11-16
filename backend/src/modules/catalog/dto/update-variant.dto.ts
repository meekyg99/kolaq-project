import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  bottleSize?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceNGN?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceUSD?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
