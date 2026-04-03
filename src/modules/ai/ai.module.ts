import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DesignCampaignUseCase } from './application/use-cases/design-campaign.use-case.js';
import { GenerateDescriptionUseCase } from './application/use-cases/generate-description.use-case.js';
import { GenerateInsightsUseCase } from './application/use-cases/generate-insights.use-case.js';
import { GenerateKpisUseCase } from './application/use-cases/generate-kpis.use-case.js';
import { GenerateSummaryUseCase } from './application/use-cases/generate-summary.use-case.js';
import { GeminiService } from './infrastructure/services/gemini.service.js';
import { AiController } from './presentation/controllers/ai.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [AiController],
  providers: [
    GeminiService,
    GenerateInsightsUseCase,
    GenerateDescriptionUseCase,
    GenerateSummaryUseCase,
    DesignCampaignUseCase,
    GenerateKpisUseCase,
  ],
})
export class AiModule {}
