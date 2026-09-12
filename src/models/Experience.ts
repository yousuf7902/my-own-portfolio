import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  title: string;
  organization: string;
  type: "work" | "education" | "volunteer";
  startDate: Date;
  endDate: Date | null;
  description: string;
  icon: string;
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    type: {
      type: String,
      enum: ["work", "education", "volunteer"],
      default: "work",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    description: { type: String, default: "" },
    icon: { type: String, default: "FaBriefcase" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ExperienceSchema.index({ order: 1 });

export default mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);
