import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Article,
  ArticleDocument,
  ArticleStatus,
} from './schemas/article.schema';
import {
  ArticleVote,
  ArticleVoteDocument,
} from './schemas/article-vote.schema';
import {
  ArticleView,
  ArticleViewDocument,
} from './schemas/article-view.schema';

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

// Caps how many *new* (never-before-seen) views/votes a single IP hash can
// generate per hour. Only checked when a visitor's cookie-derived voterHash
// hasn't already been recorded, so it targets cookie-clearing abuse without
// throttling normal repeat readers.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_NEW_VIEWS_PER_IP_PER_HOUR = 60;
const MAX_NEW_VOTES_PER_IP_PER_HOUR = 30;

export type UserVote = 1 | -1 | null;

export interface ArticleWithVote {
  article: ArticleDocument;
  userVote: UserVote;
}

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  userVote: UserVote;
}

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
  relatedArticles?: string[];
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
  titleEn?: string;
  contentEn?: string;
  tags?: string[];
  status?: ArticleStatus;
  relatedArticles?: string[];
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    !!err && typeof err === 'object' && 'code' in err && err.code === 11000
  );
}

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    @InjectModel(ArticleVote.name)
    private readonly articleVoteModel: Model<ArticleVoteDocument>,
    @InjectModel(ArticleView.name)
    private readonly articleViewModel: Model<ArticleViewDocument>,
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

  async findPublishedBySlug(slug: string): Promise<ArticleDocument> {
    const article = await this.articleModel
      .findOne({ slug, status: 'published' })
      .populate({ path: 'relatedArticles', select: 'title titleEn slug status' })
      .exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(data: ArticleCreate): Promise<Article> {
    const slug = slugify(data.title);
    const relatedArticles = await this.resolvePublishedIds(
      data.relatedArticles ?? [],
    );
    try {
      return await this.articleModel.create({
        title: data.title,
        slug,
        content: data.content,
        tags: data.tags,
        titleEn: data.titleEn || undefined,
        contentEn: data.contentEn || undefined,
        relatedArticles,
      });
    } catch (err: unknown) {
      if (isDuplicateKeyError(err)) {
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
    if (updates.relatedArticles !== undefined) {
      const selfId = String(article._id);
      const resolved = await this.resolvePublishedIds(updates.relatedArticles);
      article.relatedArticles = resolved.filter(
        (id) => id !== selfId,
      ) as unknown as Types.ObjectId[];
    }
    return article.save();
  }

  // Only articles that are currently published may be linked as "related" —
  // this keeps drafts/archived articles from being reachable through another
  // article's page, and also drops malformed/deleted ids instead of letting
  // an invalid ObjectId crash the $in query below.
  private async resolvePublishedIds(ids: string[]): Promise<string[]> {
    const candidateIds = ids.filter((id) => Types.ObjectId.isValid(id));
    if (candidateIds.length === 0) return [];
    const published = await this.articleModel
      .find({ _id: { $in: candidateIds }, status: 'published' })
      .select('_id')
      .lean()
      .exec();
    const allowed = new Set(published.map((a) => String(a._id)));
    return candidateIds.filter((id) => allowed.has(id));
  }

  async viewAndGet(
    slug: string,
    voterHash: string,
    ipHash: string,
  ): Promise<ArticleWithVote> {
    const article = await this.findPublishedBySlug(slug);
    if (await this.tryRecordView(article._id, voterHash, ipHash)) {
      article.views += 1;
    }
    const userVote = await this.getUserVoteValue(article._id, voterHash, ipHash);
    return { article, userVote };
  }

  async vote(
    slug: string,
    value: 1 | -1,
    voterHash: string,
    ipHash: string,
  ): Promise<VoteResult> {
    const article = await this.findPublishedBySlug(slug);
    return this.applyVote(article._id, value, voterHash, ipHash);
  }

  private async applyVote(
    articleId: ArticleDocument['_id'],
    value: 1 | -1,
    voterHash: string,
    ipHash: string,
    retried = false,
  ): Promise<VoteResult> {
    // Matching on voterHash OR ipHash means an incognito tab on the same
    // network picks up the vote already cast from the regular tab instead
    // of slipping past the (article, voterHash) uniqueness check.
    const existing = await this.articleVoteModel
      .findOne({ article: articleId, $or: [{ voterHash }, { ipHash }] })
      .exec();

    if (!existing) {
      if (
        !(await this.withinRateLimit(
          this.articleVoteModel,
          ipHash,
          MAX_NEW_VOTES_PER_IP_PER_HOUR,
        ))
      ) {
        throw new HttpException(
          'Too many votes from this network, try again later',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      try {
        await this.articleVoteModel.create({
          article: articleId,
          voterHash,
          ipHash,
          value,
        });
      } catch (err) {
        if (isDuplicateKeyError(err) && !retried) {
          return this.applyVote(articleId, value, voterHash, ipHash, true);
        }
        throw err;
      }
      return this.incrementVoteCounts(
        articleId,
        value === 1 ? 1 : 0,
        value === -1 ? 1 : 0,
        value,
      );
    }

    if (existing.value === value) {
      await existing.deleteOne();
      return this.incrementVoteCounts(
        articleId,
        value === 1 ? -1 : 0,
        value === -1 ? -1 : 0,
        null,
      );
    }

    existing.value = value;
    await existing.save();
    return this.incrementVoteCounts(
      articleId,
      value === 1 ? 1 : -1,
      value === -1 ? 1 : -1,
      value,
    );
  }

  private async incrementVoteCounts(
    articleId: ArticleDocument['_id'],
    upvoteDelta: number,
    downvoteDelta: number,
    userVote: UserVote,
  ): Promise<VoteResult> {
    const updated = await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { $inc: { upvotes: upvoteDelta, downvotes: downvoteDelta } },
        { new: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException('Article not found');
    }
    return { upvotes: updated.upvotes, downvotes: updated.downvotes, userVote };
  }

  private async getUserVoteValue(
    articleId: ArticleDocument['_id'],
    voterHash: string,
    ipHash: string,
  ): Promise<UserVote> {
    const vote = await this.articleVoteModel
      .findOne({ article: articleId, $or: [{ voterHash }, { ipHash }] })
      .lean()
      .exec();
    return vote ? vote.value : null;
  }

  private async tryRecordView(
    articleId: ArticleDocument['_id'],
    voterHash: string,
    ipHash: string,
  ): Promise<boolean> {
    if (
      !(await this.withinRateLimit(
        this.articleViewModel,
        ipHash,
        MAX_NEW_VIEWS_PER_IP_PER_HOUR,
      ))
    ) {
      return false;
    }
    try {
      await this.articleViewModel.create({
        article: articleId,
        voterHash,
        ipHash,
      });
    } catch (err) {
      if (isDuplicateKeyError(err)) return false;
      throw err;
    }
    await this.articleModel
      .updateOne({ _id: articleId }, { $inc: { views: 1 } })
      .exec();
    return true;
  }

  private async withinRateLimit<T extends { ipHash: string }>(
    model: Model<T>,
    ipHash: string,
    max: number,
  ): Promise<boolean> {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const count = await model
      .countDocuments({ ipHash, createdAt: { $gte: since } })
      .exec();
    return count < max;
  }
}
