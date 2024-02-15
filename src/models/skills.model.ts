import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Skills document
export interface SkillsType extends mongoose.Document {
  title: string;
  description: string;
}

// Skills Schema
const Skills = new Schema<SkillsType>({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export const SkillsModel = mongoose.model("Skills", Skills);
