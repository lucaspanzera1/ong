import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { Article, ArticleStatus } from './schemas/article.schema';
import { ArticlesService } from './articles.service';

const ARTICLE_STATUSES: ArticleStatus[] = ['published', 'archived'];

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articlesService.findPublished();
  }

  @Get('admin/all')
  @UseGuards(SessionGuard)
  findAllForAdmin(): Promise<Article[]> {
    return this.articlesService.findAllForAdmin();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Article> {
    return this.articlesService.findPublishedBySlug(slug);
  }

  @Post()
  @UseGuards(SessionGuard)
  create(
    @Body()
    body: {
      title?: string;
      content?: string;
      tags?: string[];
      titleEn?: string;
      contentEn?: string;
    },
  ): Promise<Article> {
    const title = body.title?.trim();
    const content = body.content?.trim();
    const tags = Array.isArray(body.tags)
      ? body.tags.filter((t) => typeof t === 'string' && t.trim())
      : [];
    if (!title || !content) {
      throw new BadRequestException('title and content are required');
    }
    return this.articlesService.create({
      title,
      content,
      tags,
      titleEn: body.titleEn?.trim(),
      contentEn: body.contentEn?.trim(),
    });
  }

  @Patch(':slug')
  @UseGuards(SessionGuard)
  update(
    @Param('slug') slug: string,
    @Body()
    body: {
      title?: string;
      content?: string;
      titleEn?: string;
      contentEn?: string;
      tags?: string[];
      status?: string;
    },
  ): Promise<Article> {
    const updates: {
      title?: string;
      content?: string;
      titleEn?: string;
      contentEn?: string;
      tags?: string[];
      status?: ArticleStatus;
    } = {};

    if (body.title !== undefined) {
      const title = body.title.trim();
      if (!title) throw new BadRequestException('title cannot be empty');
      updates.title = title;
    }
    if (body.content !== undefined) {
      const content = body.content.trim();
      if (!content) throw new BadRequestException('content cannot be empty');
      updates.content = content;
    }
    if (body.titleEn !== undefined) {
      updates.titleEn = body.titleEn.trim();
    }
    if (body.contentEn !== undefined) {
      updates.contentEn = body.contentEn.trim();
    }
    if (body.tags !== undefined) {
      if (!Array.isArray(body.tags))
        throw new BadRequestException('tags must be an array');
      updates.tags = body.tags.filter((t) => typeof t === 'string' && t.trim());
    }
    if (body.status !== undefined) {
      if (!ARTICLE_STATUSES.includes(body.status as ArticleStatus)) {
        throw new BadRequestException(
          'status must be "published" or "archived"',
        );
      }
      updates.status = body.status as ArticleStatus;
    }

    return this.articlesService.update(slug, updates);
  }
}
