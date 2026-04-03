import { Injectable } from '@nestjs/common';
import { CampaignEntity } from '../../domain/entities/campaign.entity.js';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.js';

@Injectable()
export class ListCampaignsUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(userId: string): Promise<CampaignEntity[]> {
    return this.campaignRepository.findAllByUserId(userId);
  }
}
