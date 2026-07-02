import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { Article } from './schemas/article.schema';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Article> {
    return this.articlesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(SessionGuard)
  create(@Body() body: { title?: string; content?: string; tags?: string[] }): Promise<Article> {
    const title = body.title?.trim();
    const content = body.content?.trim();
    const tags = Array.isArray(body.tags) ? body.tags.filter(t => typeof t === 'string' && t.trim()) : [];
    if (!title || !content) {
      throw new BadRequestException('title and content are required');
    }
    return this.articlesService.create(title, content, tags);
  }
}
