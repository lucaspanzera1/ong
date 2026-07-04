import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SessionGuard } from '../auth/auth.guard';
import { Article, ArticleStatus } from './schemas/article.schema';
import {
  ArticlesService,
  ArticleWithVote,
  VoteResult,
} from './articles.service';
import { VisitorService } from './visitor.service';

const ARTICLE_STATUSES: ArticleStatus[] = ['published', 'archived'];

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly visitorService: VisitorService,
  ) {}

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
  async findOne(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Article & { userVote: ArticleWithVote['userVote'] }> {
    const { voterHash, ipHash } = this.visitorService.identify(req, res);
    const { article, userVote } = await this.articlesService.viewAndGet(
      slug,
      voterHash,
      ipHash,
    );
    const plain = article.toObject();
    const relatedArticles = (
      (plain.relatedArticles ?? []) as unknown as Array<{
        _id: unknown;
        title: string;
        titleEn?: string;
        slug: string;
        status: ArticleStatus;
      } | null>
    )
      .filter(
        (related): related is NonNullable<typeof related> =>
          !!related && related.status === 'published',
      )
      .map(({ _id, title, titleEn, slug: relatedSlug }) => ({
        _id,
        title,
        titleEn,
        slug: relatedSlug,
      }));
    return { ...plain, relatedArticles, userVote } as unknown as Article & {
      userVote: ArticleWithVote['userVote'];
    };
  }

  @Post(':slug/vote')
  vote(
    @Param('slug') slug: string,
    @Body() body: { value?: number },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VoteResult> {
    if (body.value !== 1 && body.value !== -1) {
      throw new BadRequestException('value must be 1 or -1');
    }
    const { voterHash, ipHash } = this.visitorService.identify(req, res);
    return this.articlesService.vote(slug, body.value, voterHash, ipHash);
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
      relatedArticles?: string[];
    },
  ): Promise<Article> {
    const title = body.title?.trim();
    const content = body.content?.trim();
    const tags = Array.isArray(body.tags)
      ? body.tags.filter((t) => typeof t === 'string' && t.trim())
      : [];
    const relatedArticles = Array.isArray(body.relatedArticles)
      ? body.relatedArticles.filter((id) => typeof id === 'string' && id.trim())
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
      relatedArticles,
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
      relatedArticles?: string[];
    },
  ): Promise<Article> {
    const updates: {
      title?: string;
      content?: string;
      titleEn?: string;
      contentEn?: string;
      tags?: string[];
      status?: ArticleStatus;
      relatedArticles?: string[];
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
    if (body.relatedArticles !== undefined) {
      if (!Array.isArray(body.relatedArticles))
        throw new BadRequestException('relatedArticles must be an array');
      updates.relatedArticles = body.relatedArticles.filter(
        (id) => typeof id === 'string' && id.trim(),
      );
    }

    return this.articlesService.update(slug, updates);
  }
}
