import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  icon: string;
  percentage: number;
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "FaCode" },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ order: 1 });

export default mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
