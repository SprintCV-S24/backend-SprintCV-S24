//mongoose object for defining structure of all the documents in a mongodb collection
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export enum templates {
  JAKES = "jakes",
  BLUE = "blue",
}

//typescript type corresponding with the mongoose schema structure
export interface resumeType extends mongoose.Document {
  user: string;
  itemName: string;
  itemIds: mongoose.Types.ObjectId[];
  templateId: templates;
}

const Resume = new Schema<resumeType>({
  user: { type: String, required: true },
  itemName: { type: String, required: true },
  itemIds: { type: [Schema.Types.ObjectId], required: true },
  templateId: { type: String, enum: Object.values(templates), required: true, default: templates.JAKES },
});

export const ResumeModel = mongoose.model("Resume", Resume);