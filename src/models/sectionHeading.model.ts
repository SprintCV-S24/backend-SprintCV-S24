import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Interface for Section Heading document
export interface SectionHeadingType extends mongoose.Document {
  user: string;
  itemName: string;
  title: string;
}

// Section Heading Schema
const SectionHeading = new Schema<SectionHeadingType>({
  user: { type: String, required: true },
  itemName: { type: String, required: true },
  title: { type: String, required: true },
});

export const SectionHeadingModel = mongoose.model(
  "SectionHeading",
  SectionHeading,
);
