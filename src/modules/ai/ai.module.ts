import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { GenerateDescriptionUseCase } from './application/use-cases/generate-description.use-case.js';
import { GenerateInsightsUseCase } from './application/use-cases/generate-insights.use-case.js';
import { GeminiService } from './infrastructure/services/gemini.service.js';
import { AiController } from './presentation/controllers/ai.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [AiController],
  providers: [
    GeminiService,
    GenerateInsightsUseCase,
    GenerateDescriptionUseCase,
  ],
})
export class AiModule {}
