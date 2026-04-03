import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { CreateCampaignUseCase } from './application/use-cases/create-campaign.use-case.js';
import { DeleteCampaignUseCase } from './application/use-cases/delete-campaign.use-case.js';
import { GetCampaignUseCase } from './application/use-cases/get-campaign.use-case.js';
import { ListCampaignsUseCase } from './application/use-cases/list-campaigns.use-case.js';
import { UpdateCampaignUseCase } from './application/use-cases/update-campaign.use-case.js';
import { CampaignRepository } from './domain/repositories/campaign.repository.js';
import { PrismaCampaignRepository } from './infrastructure/repositories/prisma-campaign.repository.js';
import { CampaignController } from './presentation/controllers/campaign.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [CampaignController],
  providers: [
    ListCampaignsUseCase,
    GetCampaignUseCase,
    CreateCampaignUseCase,
    UpdateCampaignUseCase,
    DeleteCampaignUseCase,
    {
      provide: CampaignRepository,
      useClass: PrismaCampaignRepository,
    },
  ],
})
export class CampaignModule {}
