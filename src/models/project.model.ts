import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Project document
export interface ProjectType extends mongoose.Document {
	userId: string;
  bullets: string[];
  title: string;
  year: string;
}

// Project Schema
const Project = new Schema<ProjectType>({
	userId: { type: String, required: true },
  bullets: { type: [String], required: true },
  title: { type: String, required: true },
  year: { type: String, required: true },
});

export const ProjectModel = mongoose.model("Project", Project);
