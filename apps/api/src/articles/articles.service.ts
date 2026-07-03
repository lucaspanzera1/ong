import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Article,
  ArticleDocument,
  ArticleStatus,
} from './schemas/article.schema';

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface ArticleCreate {
  title: string;
  content: string;
  tags: string[];
  titleEn?: string;
  contentEn?: string;
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
  titleEn?: string;
  contentEn?: string;
  tags?: string[];
  status?: ArticleStatus;
}

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  findPublished(): Promise<Article[]> {
    return this.articleModel
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .exec();
  }

  findAllForAdmin(): Promise<Article[]> {
    return this.articleModel.find().sort({ createdAt: -1 }).exec();
  }

  async findPublishedBySlug(slug: string): Promise<Article> {
    const article = await this.articleModel
      .findOne({ slug, status: 'published' })
      .exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(data: ArticleCreate): Promise<Article> {
    const slug = slugify(data.title);
    try {
      return await this.articleModel.create({
        title: data.title,
        slug,
        content: data.content,
        tags: data.tags,
        titleEn: data.titleEn || undefined,
        contentEn: data.contentEn || undefined,
      });
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        err.code === 11000
      ) {
        throw new ConflictException('Article already exists');
      }
      throw err;
    }
  }

  async update(slug: string, updates: ArticleUpdate): Promise<Article> {
    const article = await this.articleModel.findOne({ slug }).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (updates.title !== undefined) article.title = updates.title;
    if (updates.content !== undefined) article.content = updates.content;
    if (updates.titleEn !== undefined)
      article.titleEn = updates.titleEn || undefined;
    if (updates.contentEn !== undefined)
      article.contentEn = updates.contentEn || undefined;
    if (updates.tags !== undefined) article.tags = updates.tags;
    if (updates.status !== undefined) article.status = updates.status;
    return article.save();
  }
}
