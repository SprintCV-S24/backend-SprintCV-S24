import mongoose from "mongoose";

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
  templateId: new mongoose.Types.ObjectId("75e4f54db1e12e776e01cf31"),
}


