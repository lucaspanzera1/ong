import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArticleViewDocument = HydratedDocument<ArticleView>;

@Schema({ timestamps: true })
export class ArticleView {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true })
  article: Types.ObjectId;

  @Prop({ required: true })
  voterHash: string;

  @Prop({ required: true })
  ipHash: string;
}

export const ArticleViewSchema = SchemaFactory.createForClass(ArticleView);
ArticleViewSchema.index({ article: 1, voterHash: 1 }, { unique: true });
ArticleViewSchema.index({ ipHash: 1, createdAt: 1 });
