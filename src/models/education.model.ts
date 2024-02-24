import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Education document
export interface EducationType extends mongoose.Document {
  bullets: string[];
  title: string;
  subtitle: string;
  location: string;
  year: string;
}

// Education Schema
const Education = new Schema<EducationType>({
  bullets: { type: [String], required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  location: { type: String, required: true },
  year: { type: String, required: true },
});

export const EducationModel = mongoose.model("Education", Education);
