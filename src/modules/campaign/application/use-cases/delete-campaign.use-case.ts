import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.js';

@Injectable()
export class DeleteCampaignUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada');
    }

    if (campaign.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta campanha');
    }

    await this.campaignRepository.delete(id);
  }
}
