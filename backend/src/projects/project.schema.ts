import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  fullDescription: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  thumbnailIndex: number;

  @Prop()
  liveLink: string;

  @Prop()
  githubLink: string;

  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ type: [String], default: [] })
  highlights: string[];

  @Prop({ default: 'Full Stack' })
  category: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
