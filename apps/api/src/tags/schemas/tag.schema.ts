import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ trim: true })
  nameEn?: string;

  @Prop({ required: true, trim: true })
  icon: string;

  @Prop({ type: Types.ObjectId, ref: 'Tag', default: null })
  parentId: Types.ObjectId | null;

  @Prop({ type: Number, default: 0 })
  order: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
