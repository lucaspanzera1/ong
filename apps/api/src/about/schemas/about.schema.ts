import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AboutDocument = HydratedDocument<About>;

@Schema({ timestamps: true })
export class About {
  @Prop({ required: true, default: '' })
  content: string;

  @Prop()
  contentEn?: string;
}

export const AboutSchema = SchemaFactory.createForClass(About);
