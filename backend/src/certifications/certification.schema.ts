import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Certification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  issuer: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: '' })
  verifyLink: string;

  @Prop({ default: 0 })
  order: number;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
