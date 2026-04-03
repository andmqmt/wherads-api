import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GeminiService } from '../../infrastructure/services/gemini.service.js';
import type { GenerateSummaryDto } from '../dtos/generate-summary.dto.js';

@Injectable()
export class GenerateSummaryUseCase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(
    dto: GenerateSummaryDto,
  ): Promise<{ summary: string; tips: string[] }> {
    if (!this.geminiService.isAvailable) {
      throw new ServiceUnavailableException('AI service is not configured');
    }

    const totalBudget = dto.campaigns.reduce((s, c) => s + c.budget, 0);
    const statusCounts = dto.campaigns.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const prompt = `Você é um consultor de marketing digital analisando o portfólio de campanhas de um cliente.

Dados do portfólio:
- Total de campanhas: ${dto.campaigns.length}
- Orçamento total: R$ ${totalBudget.toFixed(2)}
- Status: ${Object.entries(statusCounts)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}
- Campanhas: ${dto.campaigns.map((c) => `"${c.name}" (${c.status}, R$${c.budget})`).join('; ')}

Responda em JSON com exatamente este formato (sem markdown, sem código, apenas JSON puro):
{
  "summary": "Uma análise concisa de 2-3 frases do portfólio geral em português do Brasil",
  "tips": ["dica prática 1", "dica prática 2", "dica prática 3"]
}

As dicas devem ser específicas e acionáveis. Máximo 20 palavras por dica.`;

    const text = await this.geminiService.generateText(prompt);

    try {
      const cleaned = text
        .replace(/```json?\n?/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleaned) as {
        summary: string;
        tips: string[];
      };
      return {
        summary: parsed.summary,
        tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 5) : [],
      };
    } catch {
      return {
        summary: text.slice(0, 300),
        tips: [],
      };
    }
  }
}
