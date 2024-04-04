import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface HeadingItem {
  item: string;
  href: string | null;
}

// Interface for Contact details document
export interface HeadingType extends mongoose.Document {
  user: string;
  itemName: string;
  name: string;
  items: HeadingItem[];
}

// Schema for HeadingItem
const headingItemSchema = new Schema<HeadingItem>(
  {
    item: { type: String, required: true },
    href: { type: String, default: null }, // Assuming href can be null or a string
  },
  { _id: false },
); // _id is not needed for subdocuments by default unless you want them

// Schema for HeadingType which includes HeadingItem
const Heading = new Schema<HeadingType>({
  user: { type: String, required: true },
  itemName: { type: String, required: true },
  name: { type: String, required: true },
  items: [headingItemSchema],
});

// Contact Schema
// const Heading = new Schema<HeadingType>({
//   name: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   email: { type: String, required: true },
//   linkedIn: { type: String, required: true },
//   websitesGitHub: { type: String, required: true },
// });

export const HeadingModel = mongoose.model("Heading", Heading);
