import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Contact details document
export interface HeadingType extends mongoose.Document {
  name: string;
  phoneNumber: string;
  email: string;
  linkedIn: string;
  websitesGitHub: string;
}

// Contact Schema
const Heading = new Schema<HeadingType>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  linkedIn: { type: String, required: true },
  websitesGitHub: { type: String, required: true },
});

export const HeadingModel = mongoose.model("Heading", Heading);
