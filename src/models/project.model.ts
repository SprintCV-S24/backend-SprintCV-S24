import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Project document
export interface ProjectType extends mongoose.Document {
	user: string;
	itemName: string;
  bullets: string[];
  title: string;
	technologies?: string;
  year: string;
}

// Project Schema
const Project = new Schema<ProjectType>({
	user: { type: String, required: true },
	itemName: { type: String, required: true },
  bullets: { type: [String], required: true },
  title: { type: String, required: true },
	technologies: {type: String, required: false},
  year: { type: String, required: true },
});

export const ProjectModel = mongoose.model("Project", Project);
