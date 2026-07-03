import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { TranslateService, TranslationResult } from './translate.service';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post('article')
  @UseGuards(SessionGuard)
  translateArticle(
    @Body() body: { title?: string; content?: string },
  ): Promise<TranslationResult> {
    const title = body.title?.trim() ?? '';
    const content = body.content?.trim();
    if (!content) {
      throw new BadRequestException('content is required');
    }
    return this.translateService.translateArticle(title, content);
  }
}
