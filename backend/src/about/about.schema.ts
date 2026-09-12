import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class About extends Document {
  @Prop({ default: 'Hi,' })
  greeting: string;

  @Prop({ default: 'Myself' })
  greetingSuffix: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop()
  heroBio: string;

  @Prop()
  aboutText: string;

  @Prop()
  email: string;

  @Prop()
  resumeLink: string;

  @Prop({ default: '/images/myself.jpg' })
  profileImage: string;

  @Prop({ type: Object, default: {} })
  socials: {
    facebook?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export const AboutSchema = SchemaFactory.createForClass(About);
