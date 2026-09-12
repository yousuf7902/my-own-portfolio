import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Achievement extends Document {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  value: number;

  @Prop({ default: '+' })
  suffix: string;

  @Prop({ default: 'FaCode' })
  icon: string;

  @Prop({ default: 0 })
  order: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
