import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import { CampaignEntity } from '../../domain/entities/campaign.entity.js';
import {
  CampaignRepository,
  type CreateCampaignData,
  type UpdateCampaignData,
} from '../../domain/repositories/campaign.repository.js';

@Injectable()
export class PrismaCampaignRepository extends CampaignRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAllByUserId(userId: string): Promise<CampaignEntity[]> {
    const campaigns = await this.prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return campaigns.map((c) => new CampaignEntity(c));
  }

  async findById(id: string): Promise<CampaignEntity | null> {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    return campaign ? new CampaignEntity(campaign) : null;
  }

  async create(data: CreateCampaignData): Promise<CampaignEntity> {
    const campaign = await this.prisma.campaign.create({ data });
    return new CampaignEntity(campaign);
  }

  async update(id: string, data: UpdateCampaignData): Promise<CampaignEntity> {
    const campaign = await this.prisma.campaign.update({
      where: { id },
      data,
    });
    return new CampaignEntity(campaign);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.campaign.delete({ where: { id } });
  }
}
