import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class KpiCampaignItem {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty()
  @IsNumber()
  budget!: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  endDate?: string;
}

export class GenerateKpisDto {
  @ApiProperty({ type: [KpiCampaignItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KpiCampaignItem)
  campaigns!: KpiCampaignItem[];
}
