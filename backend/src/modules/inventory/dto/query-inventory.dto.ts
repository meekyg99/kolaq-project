import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryInventoryDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
