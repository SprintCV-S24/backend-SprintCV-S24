//mongoose object for defining structure of all the documents in a mongodb collection
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//typescript type corresponding with the mongoose schema structure
export interface resumeType extends mongoose.Document {
	user: string;
	itemName: string;
  itemIds: mongoose.Types.ObjectId[];
  templateId: mongoose.Types.ObjectId;
}

const Resume = new Schema<resumeType>({
	user: { type: String, required: true },
	itemName: { type: String, required: true, unique: true },
  itemIds: { type: [Schema.Types.ObjectId], required: true },
  templateId: { type: Schema.Types.ObjectId, required: true },
});

export const ResumeModel = mongoose.model("Resume", Resume);