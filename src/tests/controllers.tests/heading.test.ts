import { dbConnect, dbDisconnect } from "../dbHandler";
import { type HeadingType } from "../../models/heading.model";
import { headingDummyData1 } from "./dummyData";
import {
  createHeading,
  getAllHeadings,
  getHeadingById,
  updateHeading,
  deleteHeading,
} from "../../controllers/heading.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("Heading controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

  test("Adds and retrieves an heading", async () => {
    await createHeading(headingDummyData1 as HeadingType);
    const returnedHeading = await getAllHeadings(headingDummyData1.user);

    //get back the 1 heading that was added
    expect(returnedHeading.length).to.equal(1);
    expect(returnedHeading[0]).toMatchObject(headingDummyData1);

    //Can't add duplicate name
    await expect(
      createHeading(headingDummyData1 as HeadingType),
    ).rejects.toThrowError();

    const returnedHeading2 = await getAllHeadings(headingDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedHeading2.length).to.equal(1);

    const returnedHeading3 = await getAllHeadings("fakeuserid");

    //don't get records for a different user id
    expect(returnedHeading3.length).to.equal(0);
  });

  test("Finds, updates, and deletes an heading", async () => {
    await createHeading(headingDummyData1 as HeadingType);
    const returnedEd = await getAllHeadings(headingDummyData1.user);

    const returnedHeading = await getHeadingById(
      headingDummyData1.user,
      returnedEd[0]._id,
    );

    expect(returnedHeading).toMatchObject(headingDummyData1);

		const newItemName = "headingItem2";
    await updateHeading(headingDummyData1.user, returnedEd[0]._id, {
      ...headingDummyData1,
      itemName: newItemName,
    } as HeadingType);
    const returnedHeading2 = await getHeadingById(
      headingDummyData1.user,
      returnedEd[0]._id,
    );
    expect(returnedHeading2?.itemName).to.equal(newItemName);

    await deleteHeading(headingDummyData1.user, returnedEd[0]._id);
    const returnedHeading3 = await getAllHeadings(headingDummyData1.user);
    expect(returnedHeading3.length).to.equal(0);

    await expect(
      updateHeading(headingDummyData1.user, "", {} as HeadingType),
    ).rejects.toThrowError("Missing");
  });
});
