import { dbConnect, dbDisconnect } from "../dbHandler";
import { type SectionHeadingType } from "../../models/sectionHeading.model";
import { sectionHeadingDummyData1 } from "./dummyData";
import {
  createSectionHeading,
  getAllSectionHeadings,
  getSectionHeadingById,
  updateSectionHeading,
  deleteSectionHeading,
} from "../../controllers/sectionHeading.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("SectionHeadings controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

  test("Adds and retrieves an sectionHeadings", async () => {
    await createSectionHeading(sectionHeadingDummyData1 as SectionHeadingType);
    const returnedSectionHeadings = await getAllSectionHeadings(sectionHeadingDummyData1.user);

    //get back the 1 sectionHeadings that was added
    expect(returnedSectionHeadings.length).to.equal(1);
    expect(returnedSectionHeadings[0]).toMatchObject(sectionHeadingDummyData1);

    //Can't add duplicate name
    await expect(
      createSectionHeading(sectionHeadingDummyData1 as SectionHeadingType),
    ).rejects.toThrowError();

    const returnedSectionHeadings2 = await getAllSectionHeadings(sectionHeadingDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedSectionHeadings2.length).to.equal(1);

    const returnedSectionHeadings3 = await getAllSectionHeadings("fakeuserid");

    //don't get records for a different user id
    expect(returnedSectionHeadings3.length).to.equal(0);
  });

  test("Finds, updates, and deletes an sectionHeadings", async () => {
    await createSectionHeading(sectionHeadingDummyData1 as SectionHeadingType);
    const returnedEd = await getAllSectionHeadings(sectionHeadingDummyData1.user);

    const returnedSectionHeadings = await getSectionHeadingById(
      sectionHeadingDummyData1.user,
      returnedEd[0]._id,
    );

    expect(returnedSectionHeadings).toMatchObject(sectionHeadingDummyData1);

		const newItemName = "sectionHeadingsItem2";
    await updateSectionHeading(sectionHeadingDummyData1.user, returnedEd[0]._id, {
      ...sectionHeadingDummyData1,
      itemName: newItemName,
    } as SectionHeadingType);
    const returnedSectionHeadings2 = await getSectionHeadingById(
      sectionHeadingDummyData1.user,
      returnedEd[0]._id,
    );
    expect(returnedSectionHeadings2?.itemName).to.equal(newItemName);

    await deleteSectionHeading(sectionHeadingDummyData1.user, returnedEd[0]._id);
    const returnedSectionHeadings3 = await getAllSectionHeadings(sectionHeadingDummyData1.user);
    expect(returnedSectionHeadings3.length).to.equal(0);

    await expect(
      updateSectionHeading(sectionHeadingDummyData1.user, "", {} as SectionHeadingType),
    ).rejects.toThrowError("Missing");
  });
});
