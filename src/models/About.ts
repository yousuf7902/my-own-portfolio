import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  greeting: string;
  greetingSuffix: string;
  firstName: string;
  lastName: string;
  roles: string[];
  heroBio: string;
  aboutText: string;
  email: string;
  resumeLink: string;
  profileImage: string;
  socials: {
    facebook: string;
    linkedin: string;
    github: string;
    email: string;
  };
}

const AboutSchema = new Schema<IAbout>(
  {
    greeting: { type: String, default: "Hi," },
    greetingSuffix: { type: String, default: "Myself" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    roles: { type: [String], default: [] },
    heroBio: { type: String, default: "" },
    aboutText: { type: String, default: "" },
    email: { type: String, default: "" },
    resumeLink: { type: String, default: "" },
    profileImage: { type: String, default: "/images/myself.jpg" },
    socials: {
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      email: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);
