import { IsString, IsNotEmpty, IsOptional, IsArray, IsEmail } from 'class-validator';

export class BroadcastNotificationDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  recipients?: string[];

  @IsString()
  @IsOptional()
  filter?: 'all' | 'recent-customers' | 'high-value';
}
