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
		expect(returnedActivities.length).to.equal(1);
		expect(returnedActivities[0]).toMatchObject(activityDummyData1);
	})
})