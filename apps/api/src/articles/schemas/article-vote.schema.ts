import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArticleVoteDocument = HydratedDocument<ArticleVote>;

@Schema({ timestamps: true })
export class ArticleVote {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true })
  article: Types.ObjectId;

  @Prop({ required: true })
  voterHash: string;

  @Prop({ required: true })
  ipHash: string;

  @Prop({ type: Number, enum: [1, -1], required: true })
  value: 1 | -1;
}

export const ArticleVoteSchema = SchemaFactory.createForClass(ArticleVote);
// A vote is capped per browser (voterHash) AND per network (ipHash), so an
// incognito tab on the same device/network can't cast a second vote.
ArticleVoteSchema.index({ article: 1, voterHash: 1 }, { unique: true });
ArticleVoteSchema.index({ article: 1, ipHash: 1 }, { unique: true });
ArticleVoteSchema.index({ ipHash: 1, createdAt: 1 });
