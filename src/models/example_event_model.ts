//this is a model from another project with comments added

//get default import from mongoose library (which is used for interacting w/ mongodb)
import mongoose from "mongoose";

//mongoose object for defining structure of all the documents in a mongodb collection
const Schema = mongoose.Schema;

//typescript type corresponding with the mongoose schema structure
export interface eventType {
  name: string;
  description: string;
  code: string;
  date: Date;
  programs: string[];
  staff: string[];
  attended_youth?: string[];
  attached_forms?: string[];
}

//mongoose schema for an event document
const Event = new Schema<eventType>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  date: { type: Date, required: true },
  programs: { type: [String], required: true },
  staff: { type: [String], required: true }, // by Staff.fireID
  attended_youth: { type: [String], default: [] }, // by Youth.fireID
  attached_forms: { type: [String], default: [] }, // by Note._id
});

//this takes the schema and uses it to form a model object. Model objects allow us 
//to interact with mongodb, such as creating new documents or querying documents. The event 
//model object is exported so that it can be used in other files
export const EventModel = mongoose.model("Event", Event);