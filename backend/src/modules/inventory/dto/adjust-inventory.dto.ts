import { IsString, IsNotEmpty, IsInt, IsOptional, IsEmail } from 'class-validator';

export class AdjustInventoryDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  delta: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsEmail()
  @IsOptional()
  actorEmail?: string;
}
