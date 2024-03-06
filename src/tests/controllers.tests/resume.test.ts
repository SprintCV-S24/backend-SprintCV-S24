import { dbConnect, dbDisconnect } from "../dbHandler";
import { type resumeType } from "../../models/resume.model";
import { type ActivitiesType } from "../../models/activities.model";
import { resumeDummyData1, activityDummyData1 } from "./dummyData";
import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from "../../controllers/resume.controller";
import { createActivity, deleteActivity } from "../../controllers/activities.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";

describe("Resume controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

  test("Adds and retrieves a resumes", async () => {
    await createResume(resumeDummyData1 as resumeType);
    const returnedResumes = await getAllResumes(resumeDummyData1.user);

    //get back the 1 resumes that was added
    expect(returnedResumes.length).to.equal(1);
    expect(returnedResumes[0]).toMatchObject(resumeDummyData1);

    //Can't add duplicate name
    await expect(
      createResume(resumeDummyData1 as resumeType),
    ).rejects.toThrowError();

    const returnedResumes2 = await getAllResumes(resumeDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedResumes2.length).to.equal(1);

    const returnedResumes3 = await getAllResumes("fakeuserid");

    //don't get records for a different user id
    expect(returnedResumes3.length).to.equal(0);
  });

  test("Finds, updates, and deletes a resume", async () => {
    await createResume(resumeDummyData1 as resumeType);
    const returnedRe = await getAllResumes(resumeDummyData1.user);

    const returnedResumes = await getResumeById(
      resumeDummyData1.user,
      returnedRe[0]._id,
    );

    expect(returnedResumes).toMatchObject(resumeDummyData1);

		const newItemName = "resumesItem2";
    await updateResume(resumeDummyData1.user, returnedRe[0]._id, {
      ...resumeDummyData1,
      itemName: newItemName,
    } as resumeType);
    const returnedResumes2 = await getResumeById(
      resumeDummyData1.user,
      returnedRe[0]._id,
    );
    expect(returnedResumes2?.itemName).to.equal(newItemName);

    await deleteResume(resumeDummyData1.user, returnedRe[0]._id);
    const returnedResumes3 = await getAllResumes(resumeDummyData1.user);
    expect(returnedResumes3.length).to.equal(0);

    await expect(
      updateResume(resumeDummyData1.user, "", {} as resumeType),
    ).rejects.toThrowError("Missing");
  });

	test("Correctly updates resume array upon item deletion", async () => {
		const newActivity = await createActivity(activityDummyData1 as ActivitiesType);
		let resumeDummyData2 = structuredClone(resumeDummyData1);
		resumeDummyData2.itemIds = [newActivity._id];
		resumeDummyData2.templateId = new mongoose.Types.ObjectId("75e4f54db1e12e776e01cf31");
		

		const origResume = await createResume(resumeDummyData2 as resumeType);
		await deleteActivity(activityDummyData1.user, newActivity._id);
		const updatedResume = await getResumeById(origResume.user, origResume._id);

		expect(updatedResume?.itemIds).toHaveLength(0);
	})
});
