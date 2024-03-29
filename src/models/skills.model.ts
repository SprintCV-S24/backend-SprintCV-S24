import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Skills document
export interface SkillsType extends mongoose.Document {
	user: string;
	itemName: string;
  title: string;
  description: string;
}

// Skills Schema
const Skills = new Schema<SkillsType>({
	user: { type: String, required: true },
	itemName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export const SkillsModel = mongoose.model("Skills", Skills);
