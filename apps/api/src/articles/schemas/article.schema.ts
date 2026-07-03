import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleStatus = 'published' | 'archived';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  titleEn?: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  contentEn?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String, enum: ['published', 'archived'], default: 'published' })
  status: ArticleStatus;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
