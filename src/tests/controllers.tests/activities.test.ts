import { dbConnect, dbDisconnect } from "../dbHandler";
import { ActivitiesType } from "../../models/activities.model";
import { activityDummyData1 } from "./dummyData";
import { createActivity, getAllActivities } from "../../controllers/activities.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("Activities controller tests", () => {
	beforeEach(async () => dbConnect());
	afterEach(async () => dbDisconnect());

	test("Adds and retrieves an activity", async () => {
		await createActivity(activityDummyData1 as ActivitiesType);
		const returnedActivities = await getAllActivities(activityDummyData1.user);

		//get back the 1 activity that was added
		expect(returnedActivities.length).to.equal(1);
		expect(returnedActivities[0]).toMatchObject(activityDummyData1);

		//Can't add duplicate name
		await expect(createActivity(activityDummyData1 as ActivitiesType)).rejects.toThrowError();

		const returnedActivities2 = await getAllActivities(activityDummyData1.user);

		//if duplicate, shouldn't add to db
		expect(returnedActivities2.length).to.equal(1);

		const returnedActivities3 = await getAllActivities("fakeuserid");

		//don't get records for a different user id
		expect(returnedActivities3.length).to.equal(0);
	})
})