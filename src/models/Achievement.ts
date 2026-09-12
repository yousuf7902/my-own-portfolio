import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: "+" },
    icon: { type: String, default: "FaCode" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AchievementSchema.index({ order: 1 });

export default mongoose.models.Achievement ||
  mongoose.model<IAchievement>("Achievement", AchievementSchema);
