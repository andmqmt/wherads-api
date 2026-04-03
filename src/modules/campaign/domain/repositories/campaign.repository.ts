import { CampaignEntity } from '../entities/campaign.entity.js';

export type CreateCampaignData = {
  name: string;
  description?: string | null;
  budget?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  userId: string;
};

export type UpdateCampaignData = Partial<Omit<CreateCampaignData, 'userId'>> & {
  status?: CampaignEntity['status'];
};

export abstract class CampaignRepository {
  abstract findAllByUserId(userId: string): Promise<CampaignEntity[]>;
  abstract findById(id: string): Promise<CampaignEntity | null>;
  abstract create(data: CreateCampaignData): Promise<CampaignEntity>;
  abstract update(
    id: string,
    data: UpdateCampaignData,
  ): Promise<CampaignEntity>;
  abstract delete(id: string): Promise<void>;
}
