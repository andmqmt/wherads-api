import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GeminiService } from '../../infrastructure/services/gemini.service.js';
import type { DesignCampaignDto } from '../dtos/design-campaign.dto.js';

export interface CampaignDesign {
  campaignName: string;
  regions: { name: string; reason: string }[];
  audience: { segment: string; ageRange: string; interests: string[] }[];
  priceRanges: {
    channel: string;
    minBudget: number;
    maxBudget: number;
    description: string;
  }[];
  channels: { name: string; priority: string; reason: string }[];
  timeline: { phase: string; duration: string; actions: string[] }[];
  kpis: { metric: string; target: string }[];
}

@Injectable()
export class DesignCampaignUseCase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(dto: DesignCampaignDto): Promise<CampaignDesign> {
    if (!this.geminiService.isAvailable) {
      throw new ServiceUnavailableException('AI service is not configured');
    }

    const prompt = `Você é um estrategista de marketing digital sênior. Com base nas informações do cliente, crie um plano de campanha completo e detalhado.

Informações do negócio:
- Descrição: ${dto.businessDescription}
- Produtos/Serviços: ${dto.products ?? 'Não informado'}
- Região alvo: ${dto.targetRegion ?? 'Não informada (sugira as melhores)'}
- Público-alvo: ${dto.targetAudience ?? 'Não informado (sugira os melhores)'}
- Orçamento disponível: ${dto.budget ? `R$ ${dto.budget.toFixed(2)}` : 'Não definido (sugira ranges)'}
- Objetivo: ${dto.objective ?? 'Não informado'}

Responda SOMENTE em JSON puro (sem markdown, sem \`\`\`, sem comentários) com exatamente esta estrutura:
{
  "campaignName": "Nome criativo sugerido para a campanha",
  "regions": [
    { "name": "Nome da região/cidade", "reason": "Por que esta região é estratégica" }
  ],
  "audience": [
    { "segment": "Nome do segmento", "ageRange": "18-25", "interests": ["interesse1", "interesse2"] }
  ],
  "priceRanges": [
    { "channel": "Nome do canal", "minBudget": 500, "maxBudget": 2000, "description": "O que fazer com este orçamento" }
  ],
  "channels": [
    { "name": "Canal de marketing", "priority": "Alta/Média/Baixa", "reason": "Por quê" }
  ],
  "timeline": [
    { "phase": "Nome da fase", "duration": "X dias/semanas", "actions": ["ação1", "ação2"] }
  ],
  "kpis": [
    { "metric": "Nome da métrica", "target": "Meta esperada" }
  ]
}

Regras:
- Sugira 3-5 regiões estratégicas
- Defina 2-4 segmentos de público
- Inclua 3-5 canais com ranges de preço
- Crie 3-4 fases de timeline
- Sugira 4-6 KPIs específicos
- Todos os valores devem ser realistas para o mercado brasileiro
- Seja específico e prático`;

    const text = await this.geminiService.generateText(prompt);

    try {
      const cleaned = text
        .replace(/```json?\n?/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleaned) as CampaignDesign;
      return parsed;
    } catch {
      throw new ServiceUnavailableException(
        'Failed to parse AI design response',
      );
    }
  }
}
