import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CampaignEntity } from '../../domain/entities/campaign.entity.js';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.js';

@Injectable()
export class GetCampaignUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(id: string, userId: string): Promise<CampaignEntity> {
    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada');
    }

    if (campaign.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta campanha');
    }

    return campaign;
  }
}
