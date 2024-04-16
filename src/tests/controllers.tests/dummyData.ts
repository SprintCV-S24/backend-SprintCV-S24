import mongoose from "mongoose";
import { templates } from "../../models/resume.model";

export const activityDummyData1 = {
  user: "test",
  itemName: "activitesItem1",
  bullets: ["example bullet"],
  title: "title",
  subtitle: "subtitle",
  year: "year",
  location: "location",
};

export const educationDummyData1 = {
		user: "test",
		itemName: "activitiesItem1",
		bullets: ["example bullet"],
		title: "title",
		subtitle: "subtitle",
		location: "location",
		year: "year",
}

export const experienceDummyData1 = {
  user: "test",
  itemName: "activitiesItem1",
  bullets: ["example bullet"],
  title: "title",
  subtitle: "subtitle",
  location: "location",
  year: "year",
}

export const headingItemDummy = {
  item: "item",
  href: null,
}

export const headingDummyData1 = {
  user: "user",
	itemName: "itemName",
  name: "name",
  items: [headingItemDummy],
}

export const projectDummyData1 = {
  user: "test",
  itemName: "activitiesItem1",
  bullets: ["example bullet"],
  title: "title",
  year: "year",
}

export const skillsDummyData1 = {
  user: "test",
  itemName: "activitiesItem1",
  title: "title",
  description: "description"
}

export const resumeDummyData1 = {
	user: "test",
	itemName: "resumeItem1",
  itemIds: [new mongoose.Types.ObjectId("65e4f54db1e12e776e01cf31")],
  templateId: templates.BLUE,
}

export const sectionHeadingDummyData1 = {
	user: "test",
	itemName: "sectionHeadingItem1",
  title: "test section heading",
}
