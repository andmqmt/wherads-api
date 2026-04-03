import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private client: GoogleGenerativeAI | null = null;
  private readonly models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-flash-latest',
  ];

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  get isAvailable(): boolean {
    return this.client !== null;
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.client) {
      throw new ServiceUnavailableException('Gemini API key not configured');
    }

    let lastError = '';
    for (const modelName of this.models) {
      try {
        const model = this.client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error: unknown) {
        lastError = error instanceof Error ? error.message : String(error);
        continue;
      }
    }

    throw new ServiceUnavailableException(
      `All AI models failed. Last error: ${lastError.slice(0, 200)}`,
    );
  }
}
