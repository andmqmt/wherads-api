import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GeminiService } from '../../infrastructure/services/gemini.service.js';
import type { GenerateKpisDto } from '../dtos/generate-kpis.dto.js';

export interface KpiAnalytics {
  overview: {
    totalBudget: number;
    activeCampaigns: number;
    avgBudget: number;
    healthScore: number;
  };
  metrics: {
    name: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: string;
    description: string;
  }[];
  trendData: {
    label: string;
    series: { name: string; data: number[] }[];
    labels: string[];
  }[];
  projections: {
    metric: string;
    current: string;
    projected: string;
    confidence: string;
    timeframe: string;
  }[];
  recommendations: string[];
}

@Injectable()
export class GenerateKpisUseCase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(dto: GenerateKpisDto): Promise<KpiAnalytics> {
    if (!this.geminiService.isAvailable) {
      throw new ServiceUnavailableException('AI service is not configured');
    }

    const campaignsSummary = dto.campaigns
      .map(
        (c) =>
          `- ${c.name} (${c.status}, R$${c.budget}, ${c.startDate ?? 'sem data'} a ${c.endDate ?? 'sem data'})`,
      )
      .join('\n');

    const prompt = `Você é um analista de marketing digital sênior. Analise o portfólio de campanhas e gere KPIs detalhados, tendências e projeções.

Campanhas do portfólio:
${campaignsSummary}

Responda SOMENTE em JSON puro (sem markdown, sem \`\`\`, sem comentários) com esta estrutura:
{
  "overview": {
    "totalBudget": <soma dos orçamentos>,
    "activeCampaigns": <número de campanhas ativas>,
    "avgBudget": <média de orçamento>,
    "healthScore": <0 a 100, saúde geral do portfólio>
  },
  "metrics": [
    {
      "name": "Nome do KPI",
      "value": "Valor estimado",
      "trend": "up" | "down" | "stable",
      "trendValue": "+12%" ou "-5%" etc,
      "description": "Explicação breve"
    }
  ],
  "trendData": [
    {
      "label": "Nome do gráfico (ex: ROI Estimado, Alcance Projetado)",
      "series": [
        { "name": "Nome da série", "data": [10, 20, 30, 40, 50, 60] }
      ],
      "labels": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
    }
  ],
  "projections": [
    {
      "metric": "Nome da métrica",
      "current": "Valor atual estimado",
      "projected": "Valor projetado",
      "confidence": "Alta/Média/Baixa",
      "timeframe": "Próximos 30/60/90 dias"
    }
  ],
  "recommendations": [
    "Recomendação prática 1",
    "Recomendação prática 2"
  ]
}

Regras:
- Gere 6-8 métricas (CTR, CPC, CPM, ROAS, Alcance, Conversões, etc.)
- Gere 2-3 gráficos de tendência com 6 pontos cada
- Gere 4-6 projeções com diferentes timeframes
- Gere 3-5 recomendações práticas
- Valores devem ser realistas para o mercado brasileiro
- trendData.series.data deve ter exatamente o mesmo número de itens que labels
- Use dados proporcionais aos orçamentos das campanhas`;

    const text = await this.geminiService.generateText(prompt);

    try {
      const cleaned = text
        .replace(/```json?\n?/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleaned) as KpiAnalytics;
    } catch {
      throw new ServiceUnavailableException('Failed to parse AI KPI response');
    }
  }
}
