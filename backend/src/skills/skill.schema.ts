import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Skill extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'FaCode' })
  icon: string;

  @Prop({ required: true })
  percentage: number;

  @Prop({ default: 'Tools' })
  category: string;

  @Prop({ default: 0 })
  order: number;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
