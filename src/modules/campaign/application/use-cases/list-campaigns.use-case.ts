import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CampaignEntity } from '../../domain/entities/campaign.entity.js';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.js';

@Injectable()
export class ListCampaignsUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(userId: string): Promise<CampaignEntity[]> {
    const cacheKey = `campaigns:${userId}`;
    const cached = await this.cacheManager.get<CampaignEntity[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const campaigns = await this.campaignRepository.findAllByUserId(userId);
    await this.cacheManager.set(cacheKey, campaigns, 30000);
    return campaigns;
  }
}
