import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Writing extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  excerpt: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: 1 })
  readTime: number;

  @Prop({ required: true })
  publishedAt: Date;

  @Prop({ default: false })
  draft: boolean;
}

export const WritingSchema = SchemaFactory.createForClass(Writing);
