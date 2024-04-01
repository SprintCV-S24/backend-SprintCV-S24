import { dbConnect, dbDisconnect } from "../dbHandler";
import { type SkillsType } from "../../models/skills.model";
import { skillsDummyData1 } from "./dummyData";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../../controllers/skills.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("Skills controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

	test("Errors throw correctly", async () => {
		await expect(createSkill({} as SkillsType)).rejects.toThrowError("failed");
		await expect(getAllSkills({} as string)).rejects.toThrowError();
		await expect(getSkillById({} as string, {} as string)).rejects.toThrowError();
		await expect(updateSkill({} as string, {} as string, {} as SkillsType)).rejects.toThrowError();
		await expect(deleteSkill({} as string, {} as string)).rejects.toThrowError();
		await expect(deleteSkill("1234", "65f2268e3dc262b1277ba0e5")).rejects.toThrowError();
	});

  test("Adds and retrieves an skills", async () => {
    await createSkill(skillsDummyData1 as SkillsType);
    const returnedSkills = await getAllSkills(skillsDummyData1.user);

    //get back the 1 skills that was added
    expect(returnedSkills.length).to.equal(1);
    expect(returnedSkills[0]).toMatchObject(skillsDummyData1);

    //Can't add duplicate name
    await expect(
      createSkill(skillsDummyData1 as SkillsType),
    ).rejects.toThrowError();

    const returnedSkills2 = await getAllSkills(skillsDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedSkills2.length).to.equal(1);

    const returnedSkills3 = await getAllSkills("fakeuserid");

    //don't get records for a different user id
    expect(returnedSkills3.length).to.equal(0);
  });

  test("Finds, updates, and deletes an skills", async () => {
    await createSkill(skillsDummyData1 as SkillsType);
    const returnedEd = await getAllSkills(skillsDummyData1.user);

    const returnedSkills = await getSkillById(
      skillsDummyData1.user,
      returnedEd[0]._id,
    );

    expect(returnedSkills).toMatchObject(skillsDummyData1);

		const newItemName = "skillsItem2";
    await updateSkill(skillsDummyData1.user, returnedEd[0]._id, {
      ...skillsDummyData1,
      itemName: newItemName,
    } as SkillsType);
    const returnedSkills2 = await getSkillById(
      skillsDummyData1.user,
      returnedEd[0]._id,
    );
    expect(returnedSkills2?.itemName).to.equal(newItemName);

    await deleteSkill(skillsDummyData1.user, returnedEd[0]._id);
    const returnedSkills3 = await getAllSkills(skillsDummyData1.user);
    expect(returnedSkills3.length).to.equal(0);

    await expect(
      updateSkill(skillsDummyData1.user, "", {} as SkillsType),
    ).rejects.toThrowError("Missing");
  });
});
