import { IsString, IsInt, IsEmail, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  productId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  comment: string;
}
