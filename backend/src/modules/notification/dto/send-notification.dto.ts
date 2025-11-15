import { IsString, IsNotEmpty, IsOptional, IsEmail, IsObject } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  type: 'EMAIL' | 'SMS' | 'WHATSAPP';

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
