/* v8 ignore start */
//folder has not yet been implemented

//mongoose object for defining structure of all the documents in a mongodb collection
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//typescript type corresponding with the mongoose schema structure
export interface folderType extends mongoose.Document {
	user: string;
  name: string;
  resumeIds: mongoose.Schema.Types.ObjectId[];
  folderIds: mongoose.Schema.Types.ObjectId[];
}

const Folder = new Schema<folderType>({
	user: { type: String, required: true },
  name: { type: String, required: true },
  resumeIds: { type: [Schema.Types.ObjectId], required: true, ref: 'ResumeModel' },
  folderIds: { type: [Schema.Types.ObjectId], required: true, ref: 'FolderModel' },
});

export const FolderModel = mongoose.model("Folder", Folder);

/* v8 ignore stop */