import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  thumbnailIndex: number;
  liveLink: string;
  githubLink: string;
  technologies: string[];
  category: string;
  startDate: Date | null;
  endDate: Date | null;
  featured: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    images: { type: [String], default: [] },
    thumbnailIndex: { type: Number, default: 0 },
    liveLink: { type: String, default: "" },
    githubLink: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    category: { type: String, default: "Full Stack" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ order: 1 });

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
