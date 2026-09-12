import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Experience extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  organization: string;

  @Prop({ enum: ['work', 'education', 'volunteer'], default: 'work' })
  type: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ default: 'FaBriefcase' })
  icon: string;

  @Prop({ default: 0 })
  order: number;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
