import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GeminiService } from '../../infrastructure/services/gemini.service.js';
import type { GenerateInsightsDto } from '../dtos/generate-insights.dto.js';

@Injectable()
export class GenerateInsightsUseCase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(dto: GenerateInsightsDto): Promise<{ insights: string }> {
    if (!this.geminiService.isAvailable) {
      throw new ServiceUnavailableException('AI service is not configured');
    }

    const prompt = `Você é um especialista em marketing digital e comportamento do consumidor.
Analise a seguinte campanha de marketing e forneça insights acionáveis:

Nome: ${dto.campaignName}
Descrição: ${dto.description ?? 'Não informada'}
Status: ${dto.status}
Orçamento: R$ ${dto.budget.toFixed(2)}
Período: ${dto.startDate ?? 'Não definido'} até ${dto.endDate ?? 'Não definido'}

Forneça uma análise estruturada em formato markdown com:
1. **Análise do público-alvo** — Quem seria o público ideal para esta campanha
2. **Otimização de orçamento** — Como melhor distribuir o orçamento de R$ ${dto.budget.toFixed(2)}
3. **Recomendações de canais** — Quais canais de marketing seriam mais eficazes
4. **Timing** — Sugestões sobre o melhor momento/frequência
5. **KPIs sugeridos** — Métricas para acompanhar o sucesso

Seja específico e prático. Responda em português do Brasil. Máximo 500 palavras.`;

    const insights = await this.geminiService.generateText(prompt);
    return { insights };
  }
}
