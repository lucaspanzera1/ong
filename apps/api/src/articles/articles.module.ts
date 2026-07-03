import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ArticleVote, ArticleVoteSchema } from './schemas/article-vote.schema';
import { ArticleView, ArticleViewSchema } from './schemas/article-view.schema';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { VisitorService } from './visitor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleVote.name, schema: ArticleVoteSchema },
      { name: ArticleView.name, schema: ArticleViewSchema },
    ]),
    AuthModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, VisitorService],
})
export class ArticlesModule {}
