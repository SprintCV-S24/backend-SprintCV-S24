import { dbConnect, dbDisconnect } from "../dbHandler";
import { type ActivitiesType } from "../../models/activities.model";
import { activityDummyData1 } from "./dummyData";
import {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../../controllers/activities.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("Activities controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

	test("Errors throw correctly", async () => {
		await expect(createActivity({} as ActivitiesType)).rejects.toThrowError("failed");
		await expect(getAllActivities({} as string)).rejects.toThrowError();
		await expect(getActivityById({} as string, {} as string)).rejects.toThrowError();
		await expect(updateActivity({} as string, {} as string, {} as ActivitiesType)).rejects.toThrowError();
		await expect(deleteActivity({} as string, {} as string)).rejects.toThrowError();
		await expect(deleteActivity("1234", "65f2268e3dc262b1277ba0e5")).rejects.toThrowError();
	});

  test("Adds and retrieves an activity", async () => {
		await createActivity(activityDummyData1 as ActivitiesType);
    const returnedActivities = await getAllActivities(activityDummyData1.user);

    //get back the 1 activity that was added
    expect(returnedActivities.length).to.equal(1);
    expect(returnedActivities[0]).toMatchObject(activityDummyData1);

    //Can't add duplicate name
    await expect(
      createActivity(activityDummyData1 as ActivitiesType),
    ).rejects.toThrowError();

    const returnedActivities2 = await getAllActivities(activityDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedActivities2.length).to.equal(1);

    const returnedActivities3 = await getAllActivities("fakeuserid");

    //don't get records for a different user id
    expect(returnedActivities3.length).to.equal(0);
  });

  test("Finds, updates, and deletes an activity", async () => {
    await createActivity(activityDummyData1 as ActivitiesType);
    const returnedActivities = await getAllActivities(activityDummyData1.user);

    const returnedActivity = await getActivityById(
      activityDummyData1.user,
      returnedActivities[0]._id,
    );

    expect(returnedActivity).toMatchObject(activityDummyData1);

		const newItem = "activitiesItem2";
    await updateActivity(activityDummyData1.user, returnedActivities[0]._id, {
      ...activityDummyData1,
      itemName: newItem,
    } as ActivitiesType);
    const returnedActivity2 = await getActivityById(
      activityDummyData1.user,
      returnedActivities[0]._id,
    );
    expect(returnedActivity2?.itemName).to.equal(newItem);

    await deleteActivity(activityDummyData1.user, returnedActivities[0]._id);
    const returnedActivities3 = await getAllActivities(activityDummyData1.user);
    expect(returnedActivities3.length).to.equal(0);

    await expect(
      updateActivity(activityDummyData1.user, "", {} as ActivitiesType),
    ).rejects.toThrowError("Missing");
  });
});
