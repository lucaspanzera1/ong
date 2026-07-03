import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PageViewDevice = 'mobile' | 'tablet' | 'desktop';

export type PageViewDocument = HydratedDocument<PageView>;

@Schema({ timestamps: true })
export class PageView {
  @Prop({ required: true })
  visitorHash: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  path: string;

  @Prop({ trim: true })
  referrerHost?: string;

  @Prop({ type: String, enum: ['mobile', 'tablet', 'desktop'], required: true })
  device: PageViewDevice;

  @Prop({ trim: true })
  browser?: string;

  @Prop({ trim: true, uppercase: true })
  country?: string;
}

export const PageViewSchema = SchemaFactory.createForClass(PageView);
// Storage-limitation: pageviews auto-expire ~13 months after creation.
PageViewSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 396 },
);
// Needed for the self-service "delete my data" endpoint.
PageViewSchema.index({ visitorHash: 1 });
