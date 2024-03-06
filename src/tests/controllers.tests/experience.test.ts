import { dbConnect, dbDisconnect } from "../dbHandler";
import { type ExperienceType } from "../../models/experience.model";
import { experienceDummyData1 } from "./dummyData";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "../../controllers/experience.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("Experience controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

  test("Adds and retrieves an experience", async () => {
    await createExperience(experienceDummyData1 as ExperienceType);
    const returnedExperience = await getAllExperiences(experienceDummyData1.user);

    //get back the 1 experience that was added
    expect(returnedExperience.length).to.equal(1);
    expect(returnedExperience[0]).toMatchObject(experienceDummyData1);

    //Can't add duplicate name
    await expect(
      createExperience(experienceDummyData1 as ExperienceType),
    ).rejects.toThrowError();

    const returnedExperience2 = await getAllExperiences(experienceDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedExperience2.length).to.equal(1);

    const returnedExperience3 = await getAllExperiences("fakeuserid");

    //don't get records for a different user id
    expect(returnedExperience3.length).to.equal(0);
  });

  test("Finds, updates, and deletes an experience", async () => {
    await createExperience(experienceDummyData1 as ExperienceType);
    const returnedEd = await getAllExperiences(experienceDummyData1.user);

    const returnedExperience = await getExperienceById(
      experienceDummyData1.user,
      returnedEd[0]._id,
    );

    expect(returnedExperience).toMatchObject(experienceDummyData1);

		const newItemName = "experienceItem2";
    await updateExperience(experienceDummyData1.user, returnedEd[0]._id, {
      ...experienceDummyData1,
      itemName: newItemName,
    } as ExperienceType);
    const returnedExperience2 = await getExperienceById(
      experienceDummyData1.user,
      returnedEd[0]._id,
    );
    expect(returnedExperience2?.itemName).to.equal(newItemName);

    await deleteExperience(experienceDummyData1.user, returnedEd[0]._id);
    const returnedExperience3 = await getAllExperiences(experienceDummyData1.user);
    expect(returnedExperience3.length).to.equal(0);

    await expect(
      updateExperience(experienceDummyData1.user, "", {} as ExperienceType),
    ).rejects.toThrowError("Missing");
  });
});
