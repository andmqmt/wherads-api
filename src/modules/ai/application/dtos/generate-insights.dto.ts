import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateInsightsDto {
  @ApiProperty({ example: 'Campanha Black Friday' })
  @IsString()
  @IsNotEmpty()
  campaignName!: string;

  @ApiProperty({
    example: 'Campanha focada em descontos de eletrônicos',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'ACTIVE' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  budget!: number;

  @ApiProperty({ example: '2026-01-01', required: false })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2026-03-01', required: false })
  @IsString()
  @IsOptional()
  endDate?: string;
}
