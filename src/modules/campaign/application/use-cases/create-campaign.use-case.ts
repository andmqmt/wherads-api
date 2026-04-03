import { Injectable } from '@nestjs/common';
import { CampaignEntity } from '../../domain/entities/campaign.entity.js';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.js';
import { CreateCampaignDto } from '../dtos/create-campaign.dto.js';

@Injectable()
export class CreateCampaignUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(
    dto: CreateCampaignDto,
    userId: string,
  ): Promise<CampaignEntity> {
    return this.campaignRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      budget: dto.budget ?? 0,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      userId,
    });
  }
}
