import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ trim: true })
  nameEn?: string;

  @Prop({ required: true, trim: true })
  icon: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
