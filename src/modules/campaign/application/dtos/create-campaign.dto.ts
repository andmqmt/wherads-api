import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Campanha Black Friday' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiPropertyOptional({ example: 'Campanha de promoções de Black Friday' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ example: '2026-11-25T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-11-30T23:59:59.000Z' })
  @IsString()
  @IsOptional()
  endDate?: string;
}
