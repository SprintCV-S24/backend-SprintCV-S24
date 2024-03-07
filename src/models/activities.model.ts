import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Interface for Activities document in MongoDB.
 */
export interface ActivitiesType extends mongoose.Document {
	user: string;
	itemName: string;
  bullets: string[];
  title: string;
  subtitle: string;
  year: string;
  location: string;
}

/**
 * Schema definition for the Activities document.
 */
const Activities = new Schema<ActivitiesType>({
	user: { type: String, required: true },
	itemName: { type: String, required: true },
  bullets: { type: [String], required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  year: { type: String, required: true },
  location: { type: String, required: true },
});

/**
 * Activities model based on the Activities schema.
 */
export const ActivitiesModel = mongoose.model("Activities", Activities);