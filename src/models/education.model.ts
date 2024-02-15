import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Education document
export interface EducationType extends mongoose.Document {
  description: string;
  title: string;
  subtitle: string;
  location: string;
  year: string;
}

// Education Schema
const Education = new Schema<EducationType>({
  description: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  location: { type: String, required: true },
  year: { type: String, required: true },
});

export { Education };
