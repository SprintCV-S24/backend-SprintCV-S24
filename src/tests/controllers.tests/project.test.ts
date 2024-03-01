import { dbConnect, dbDisconnect } from "../dbHandler";
import { type ProjectType } from "../../models/project.model";
import { projectDummyData1 } from "./dummyData";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../../controllers/project.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

describe("Project controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

  test("Adds and retrieves an project", async () => {
    await createProject(projectDummyData1 as ProjectType);
    const returnedProject = await getAllProjects(projectDummyData1.user);

    //get back the 1 project that was added
    expect(returnedProject.length).to.equal(1);
    expect(returnedProject[0]).toMatchObject(projectDummyData1);

    //Can't add duplicate name
    await expect(
      createProject(projectDummyData1 as ProjectType),
    ).rejects.toThrowError();

    const returnedProject2 = await getAllProjects(projectDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedProject2.length).to.equal(1);

    const returnedProject3 = await getAllProjects("fakeuserid");

    //don't get records for a different user id
    expect(returnedProject3.length).to.equal(0);
  });

  test("Finds, updates, and deletes an project", async () => {
    await createProject(projectDummyData1 as ProjectType);
    const returnedEd = await getAllProjects(projectDummyData1.user);

    const returnedProject = await getProjectById(
      projectDummyData1.user,
      returnedEd[0]._id,
    );

    expect(returnedProject).toMatchObject(projectDummyData1);

		const newItemName = "projectItem2";
    await updateProject(projectDummyData1.user, returnedEd[0]._id, {
      ...projectDummyData1,
      itemName: newItemName,
    } as ProjectType);
    const returnedProject2 = await getProjectById(
      projectDummyData1.user,
      returnedEd[0]._id,
    );
    expect(returnedProject2?.itemName).to.equal(newItemName);

    await deleteProject(projectDummyData1.user, returnedEd[0]._id);
    const returnedProject3 = await getAllProjects(projectDummyData1.user);
    expect(returnedProject3.length).to.equal(0);

    await expect(
      updateProject(projectDummyData1.user, "", {} as ProjectType),
    ).rejects.toThrowError("Missing");
  });
});
