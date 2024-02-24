//get default import from mongoose library (which is used for interacting w/ mongodb)
import mongoose from "mongoose";

//mongoose object for defining structure of all the documents in a mongodb collection
const Schema = mongoose.Schema;

//typescript type corresponding with the mongoose schema structure
export interface experienceType extends mongoose.Document {
	userId: string;
  bullets: string[];
  title: string;
  subtitle: string;
  date: string;
  location: string;
}

//mongoose schema for an event document
const Experience = new Schema<experienceType>({
	userId: { type: String, required: true },
  bullets: { type: [String], required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
});

export const ExperienceModel = mongoose.model("Experience", Experience);
