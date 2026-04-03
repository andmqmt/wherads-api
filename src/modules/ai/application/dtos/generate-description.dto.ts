import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateDescriptionDto {
  @ApiProperty({ example: 'Campanha Black Friday' })
  @IsString()
  @IsNotEmpty()
  campaignName!: string;

  @ApiProperty({
    example: 'eletrônicos, descontos, jovens adultos',
    required: false,
  })
  @IsString()
  @IsOptional()
  keywords?: string;

  @ApiProperty({ example: 10000, required: false })
  @IsNumber()
  @IsOptional()
  budget?: number;
}
