import { dbConnect, dbDisconnect } from "../dbHandler";
import { type EducationType } from "../../models/education.model";
import { educationDummyData1 } from "./dummyData";
import {
  createEducation,
  getAllEducation,
  getEducationById,
  updateEducation,
  deleteEducation,
} from "../../controllers/education.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("Education controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

	test("Errors throw correctly", async () => {
		await expect(createEducation({} as EducationType)).rejects.toThrowError("failed");
		await expect(getAllEducation({} as string)).rejects.toThrowError();
		await expect(getEducationById({} as string, {} as string)).rejects.toThrowError();
		await expect(updateEducation({} as string, {} as string, {} as EducationType)).rejects.toThrowError();
		await expect(deleteEducation({} as string, {} as string)).rejects.toThrowError();
		await expect(deleteEducation("1234", "65f2268e3dc262b1277ba0e5")).rejects.toThrowError();
	});

  test("Adds and retrieves an education", async () => {
    await createEducation(educationDummyData1 as EducationType);
    const returnedEducation = await getAllEducation(educationDummyData1.user);

    //get back the 1 education that was added
    expect(returnedEducation.length).to.equal(1);
    expect(returnedEducation[0]).toMatchObject(educationDummyData1);

    //Can't add duplicate name
    await expect(
      createEducation(educationDummyData1 as EducationType),
    ).rejects.toThrowError();

    const returnedEducation2 = await getAllEducation(educationDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedEducation2.length).to.equal(1);

    const returnedEducation3 = await getAllEducation("fakeuserid");

    //don't get records for a different user id
    expect(returnedEducation3.length).to.equal(0);
  });

  test("Finds, updates, and deletes an education", async () => {
    await createEducation(educationDummyData1 as EducationType);
    const returnedEd = await getAllEducation(educationDummyData1.user);

    const returnedEducation = await getEducationById(
      educationDummyData1.user,
      returnedEd[0]._id,
    );

    expect(returnedEducation).toMatchObject(educationDummyData1);

		const newItemName = "educationItem2";
    await updateEducation(educationDummyData1.user, returnedEd[0]._id, {
      ...educationDummyData1,
      itemName: newItemName,
    } as EducationType);
    const returnedEducation2 = await getEducationById(
      educationDummyData1.user,
      returnedEd[0]._id,
    );
    expect(returnedEducation2?.itemName).to.equal(newItemName);

    await deleteEducation(educationDummyData1.user, returnedEd[0]._id);
    const returnedEducation3 = await getAllEducation(educationDummyData1.user);
    expect(returnedEducation3.length).to.equal(0);

    await expect(
      updateEducation(educationDummyData1.user, "", {} as EducationType),
    ).rejects.toThrowError("Missing");
  });
});
