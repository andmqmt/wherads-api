import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard.js';
import { GenerateDescriptionDto } from '../../application/dtos/generate-description.dto.js';
import { GenerateInsightsDto } from '../../application/dtos/generate-insights.dto.js';
import { GenerateDescriptionUseCase } from '../../application/use-cases/generate-description.use-case.js';
import { GenerateInsightsUseCase } from '../../application/use-cases/generate-insights.use-case.js';
import { GeminiService } from '../../infrastructure/services/gemini.service.js';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly generateInsightsUseCase: GenerateInsightsUseCase,
    private readonly generateDescriptionUseCase: GenerateDescriptionUseCase,
    private readonly geminiService: GeminiService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Verificar se o serviço de IA está disponível' })
  @ApiResponse({ status: 200, description: 'Status do serviço de IA' })
  getStatus() {
    return { available: this.geminiService.isAvailable };
  }

  @Post('insights')
  @ApiOperation({ summary: 'Gerar insights de IA para uma campanha' })
  @ApiResponse({ status: 200, description: 'Insights gerados com sucesso' })
  @ApiResponse({ status: 503, description: 'Serviço de IA indisponível' })
  async generateInsights(@Body() dto: GenerateInsightsDto) {
    return this.generateInsightsUseCase.execute(dto);
  }

  @Post('generate-description')
  @ApiOperation({ summary: 'Gerar descrição de campanha com IA' })
  @ApiResponse({ status: 200, description: 'Descrição gerada com sucesso' })
  @ApiResponse({ status: 503, description: 'Serviço de IA indisponível' })
  async generateDescription(@Body() dto: GenerateDescriptionDto) {
    return this.generateDescriptionUseCase.execute(dto);
  }
}
