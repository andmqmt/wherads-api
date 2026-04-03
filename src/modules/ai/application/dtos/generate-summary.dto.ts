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

class CampaignSummaryItem {
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
}

export class GenerateSummaryDto {
  @ApiProperty({ type: [CampaignSummaryItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CampaignSummaryItem)
  campaigns!: CampaignSummaryItem[];
}
