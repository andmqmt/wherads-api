import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class DesignCampaignDto {
  @ApiProperty({ example: 'Loja de eletrônicos em São Paulo' })
  @IsString()
  @IsNotEmpty()
  businessDescription!: string;

  @ApiPropertyOptional({ example: 'smartphones, notebooks, gamers' })
  @IsString()
  @IsOptional()
  products?: string;

  @ApiPropertyOptional({ example: 'São Paulo, Rio de Janeiro' })
  @IsString()
  @IsOptional()
  targetRegion?: string;

  @ApiPropertyOptional({ example: 'jovens adultos 18-35 anos' })
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ example: 'Black Friday, vendas online' })
  @IsString()
  @IsOptional()
  objective?: string;
}
