import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export class AnalyticsQueryDto {
  @ApiProperty({ enum: TimeRange, default: TimeRange.MONTH })
  @IsEnum(TimeRange)
  @IsOptional()
  range?: TimeRange = TimeRange.MONTH;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class ForecastQueryDto {
  @ApiProperty({ description: 'Number of days to forecast', default: 30 })
  @IsOptional()
  days?: number = 30;

  @ApiProperty({ description: 'Product ID to forecast', required: false })
  @IsOptional()
  productId?: string;
}
