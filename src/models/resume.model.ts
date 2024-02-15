//mongoose object for defining structure of all the documents in a mongodb collection
import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

//typescript type corresponding with the mongoose schema structure
export interface resumeType extends mongoose.Document{
	itemIds: mongoose.Schema.Types.ObjectId[],
	templateId: mongoose.Schema.Types.ObjectId,
}

const Event = new Schema<resumeType>({
	itemIds: {type: [Schema.Types.ObjectId], required: true},
	templateId: {type: Schema.Types.ObjectId, required: true}
})