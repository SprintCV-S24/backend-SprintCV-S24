import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Activities document
export interface ActivitiesType extends mongoose.Document {
  id: string;
  s3FileId: string;
  description: string;
  title: string;
  subtitle: string;
  year: string;
  location: string;
}

// Activities Schema
const Activities = new Schema<ActivitiesType>({
  id: { type: String, required: true },
  s3FileId: { type: String, required: true },
  description: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  year: { type: String, required: true },
  location: { type: String, required: true },
});

export { Activities };
