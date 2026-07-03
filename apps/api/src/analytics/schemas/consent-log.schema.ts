import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConsentLogDocument = HydratedDocument<ConsentLog>;

// Audit trail proving consent was captured. Kept without a TTL, deliberately
// outliving the PageView data it authorizes (see page-view.schema.ts).
@Schema({ timestamps: true })
export class ConsentLog {
  @Prop({ required: true })
  visitorHash: string;

  @Prop({ required: true })
  policyVersion: number;
}

export const ConsentLogSchema = SchemaFactory.createForClass(ConsentLog);
ConsentLogSchema.index({ visitorHash: 1 });
