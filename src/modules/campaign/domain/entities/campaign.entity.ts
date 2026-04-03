import { CampaignStatus } from '../../../../../generated/prisma/client.js';

export class CampaignEntity {
  id!: string;
  name!: string;
  description!: string | null;
  status!: CampaignStatus;
  budget!: number;
  startDate!: Date | null;
  endDate!: Date | null;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<CampaignEntity>) {
    Object.assign(this, partial);
  }
}
