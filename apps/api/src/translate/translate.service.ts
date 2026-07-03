import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

export interface TranslationResult {
  title: string;
  content: string;
}

@Injectable()
export class TranslateService {
  private client: Groq | null = null;

  constructor(private readonly config: ConfigService) {}

  private getClient(): Groq {
    if (!this.client) {
      const apiKey = this.config.get<string>('GROQ_API_KEY');
      if (!apiKey) {
        throw new InternalServerErrorException(
          'GROQ_API_KEY is not configured',
        );
      }
      this.client = new Groq({ apiKey });
    }
    return this.client;
  }

  async translateArticle(
    title: string,
    content: string,
  ): Promise<TranslationResult> {
    const completion = await this.getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_completion_tokens: 8192,
      top_p: 1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a professional translator. Translate the given blog article from Portuguese to English. ' +
            'Preserve the Markdown formatting exactly (headings, bold, italics, links, image references, code blocks, lists). ' +
            'Do not translate content inside code blocks, URLs, or image paths. ' +
            'Respond with ONLY a JSON object of the form {"title": string, "content": string} and nothing else.',
        },
        {
          role: 'user',
          content: JSON.stringify({ title, content }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new InternalServerErrorException(
        'Empty response from translation service',
      );
    }

    let parsed: Partial<TranslationResult>;
    try {
      parsed = JSON.parse(raw) as Partial<TranslationResult>;
    } catch {
      throw new InternalServerErrorException(
        'Failed to parse translation response',
      );
    }

    if (
      typeof parsed.title !== 'string' ||
      typeof parsed.content !== 'string'
    ) {
      throw new InternalServerErrorException(
        'Malformed translation response',
      );
    }

    return { title: parsed.title, content: parsed.content };
  }
}
