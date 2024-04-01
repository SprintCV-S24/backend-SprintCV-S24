import { dbConnect, dbDisconnect } from "../dbHandler";
import { type folderType } from "../../models/folder.model";
import { type resumeType } from "../../models/resume.model";
import { folderDummyData1, activityDummyData1, resumeDummyData1 } from "./dummyData";
import {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} from "../../controllers/folder.controller";
import { createResume, deleteResume } from "../../controllers/resume.controller";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";


describe("Folder controller tests", () => {
  beforeEach(async () => dbConnect());
  afterEach(async () => dbDisconnect());

  test("Adds and retrieves a folders", async () => {
    await createFolder(folderDummyData1 as folderType);
    const returnedFolders = await getAllFolders(folderDummyData1.user);

    //get back the 1 folders that was added
    expect(returnedFolders.length).to.equal(1);
    expect(returnedFolders[0]).toMatchObject(folderDummyData1);

    //Can't add duplicate name
    await expect(
      createFolder(folderDummyData1 as folderType),
    ).rejects.toThrowError();

    const returnedFolders2 = await getAllFolders(folderDummyData1.user);

    //if duplicate, shouldn't add to db
    expect(returnedFolders2.length).to.equal(1);

    const returnedFolders3 = await getAllFolders("fakeuserid");

    //don't get records for a different user id
    expect(returnedFolders3.length).to.equal(0);
  });

  test("Finds, updates, and deletes a folder", async () => {
    await createFolder(folderDummyData1 as folderType);
    const returnedRe = await getAllFolders(folderDummyData1.user);

    const returnedFolders = await getFolderById(
      folderDummyData1.user,
      returnedRe[0]._id,
    );

    expect(returnedFolders).toMatchObject(folderDummyData1);

		const newItemName = "foldersItem2";
    await updateFolder(folderDummyData1.user, returnedRe[0]._id, {
      ...folderDummyData1,
      itemName: newItemName,
    } as folderType);
    const returnedFolders2 = await getFolderById(
      folderDummyData1.user,
      returnedRe[0]._id,
    );
    expect(returnedFolders2?.itemName).to.equal(newItemName);

    await deleteFolder(folderDummyData1.user, returnedRe[0]._id);
    const returnedFolders3 = await getAllFolders(folderDummyData1.user);
    expect(returnedFolders3.length).to.equal(0);

    await expect(
      updateFolder(folderDummyData1.user, "", {} as folderType),
    ).rejects.toThrowError("Missing");
  });

	test("Correctly updates folder array upon item deletion", async () => {
		const newResume = await createResume(resumeDummyData1 as resumeType);
		let folderDummyData2 = structuredClone(folderDummyData1);
		folderDummyData2.resumeIds = [newResume._id];
		folderDummyData2.folderIds = [new mongoose.Types.ObjectId("75e4f54db1e12e776e01cf31")];
		

		const origFolder = await createFolder(folderDummyData2 as folderType);
		await deleteResume(resumeDummyData1.user, newResume._id);
		const updatedFolder = await getFolderById(origFolder.user, origFolder._id);

		expect(updatedFolder?.resumeIds).toHaveLength(0);
	})
});
