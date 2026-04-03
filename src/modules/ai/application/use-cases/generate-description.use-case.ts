import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GeminiService } from '../../infrastructure/services/gemini.service.js';
import type { GenerateDescriptionDto } from '../dtos/generate-description.dto.js';

@Injectable()
export class GenerateDescriptionUseCase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(dto: GenerateDescriptionDto): Promise<{ description: string }> {
    if (!this.geminiService.isAvailable) {
      throw new ServiceUnavailableException('AI service is not configured');
    }

    const prompt = `Você é um copywriter especialista em campanhas de marketing digital.
Gere uma descrição profissional e persuasiva para a seguinte campanha:

Nome da campanha: ${dto.campaignName}
Palavras-chave/contexto: ${dto.keywords ?? 'Não informadas'}
Orçamento estimado: ${dto.budget ? `R$ ${dto.budget.toFixed(2)}` : 'Não definido'}

A descrição deve:
- Ter entre 2 e 4 frases
- Ser clara e objetiva
- Destacar o objetivo e o público-alvo
- Usar tom profissional

Responda APENAS com a descrição, sem explicações adicionais. Em português do Brasil.`;

    const description = await this.geminiService.generateText(prompt);
    return { description: description.trim() };
  }
}
