import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

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

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private readonly articleModel: Model<ArticleDocument>) {}

  findAll(): Promise<Article[]> {
    return this.articleModel.find().sort({ createdAt: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleModel.findOne({ slug }).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(title: string, content: string, tags: string[]): Promise<Article> {
    const slug = slugify(title);
    try {
      return await this.articleModel.create({ title, slug, content, tags });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
        throw new ConflictException('Article already exists');
      }
      throw err;
    }
  }
}
