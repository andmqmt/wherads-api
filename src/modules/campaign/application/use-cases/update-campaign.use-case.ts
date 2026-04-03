import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CampaignEntity } from '../../domain/entities/campaign.entity.js';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.js';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto.js';

@Injectable()
export class UpdateCampaignUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async execute(
    id: string,
    dto: UpdateCampaignDto,
    userId: string,
  ): Promise<CampaignEntity> {
    const campaign = await this.campaignRepository.findById(id);

    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada');
    }

    if (campaign.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta campanha');
    }

    return this.campaignRepository.update(id, {
      name: dto.name,
      description: dto.description,
      status: dto.status,
      budget: dto.budget,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }
}
