import { SkillsModel, type SkillsType } from "../models/skills.model";
import { ResumeModel } from "../models/resume.model";
import mongoose from "mongoose";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createSkill = async (skillsFields: SkillsType) => {
  try {
		if(await checkDuplicateItemName(skillsFields.user, skillsFields.itemName)){
			throw new HttpError(
				HttpStatus.BAD_REQUEST,
				"Duplicate item name",
			)
		}

    const newSkills = new SkillsModel(skillsFields);
    await newSkills.save();
    return newSkills;
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      throw err;
    }

    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Skill creation failed",
      { cause: err },
    );
  }
};

export const getAllSkills = async (user: string) => {
	try {
    const skills = await SkillsModel.find({ user: user });
    return skills;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Skills retrieval failed",
      { cause: err },
    );
  }
}

export const getSkillById = async (user: string, skillId: string) => {
  try {
    const skill = await SkillsModel.findOne({
      user: user,
      _id: skillId,
    });
    return skill;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Skill retrieval failed",
      { cause: err },
    );
  }
};

export const updateSkill = async (
  user: string,
	skillId: string,
  skillsFields: SkillsType,
) => {
  try {
    if (!skillId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Missing skill ID for update",
      );
    }

		if (skillsFields.itemName != null && await checkDuplicateItemName(skillsFields.user, skillsFields.itemName, skillId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Duplicate item name");
    }

    const updatedSkill = await SkillsModel.findOneAndUpdate(
      { _id: skillId, user: user }, // Query to match the document by _id and user
      { $set: skillsFields }, // Update operation
      { new: true, runValidators: true }, // Options: return the updated document and run schema validators
    );
    return updatedSkill;
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Skill update failed",
      { cause: err },
    );
  }
};

export const deleteSkill = async (user: string, skillId: string) => {
  try {
		await ResumeModel.updateMany(
			{ itemIds: new mongoose.Types.ObjectId(skillId) },
			{ $pull: { itemIds: new mongoose.Types.ObjectId(skillId) } }
		);

    const deletedSkill = await SkillsModel.findOneAndDelete({
      _id: skillId,
      user: user,
    });
    if (!deletedSkill) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Skill not found or already deleted",
      );
    }
    return { message: "Skill deleted successfully" };
  } catch (err: unknown) {
    //rethrow any errors as HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    //checks if mongoose threw and will rethrow with appropriate status code and message
    checkMongooseErrors(err);

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Skill deletion failed",
      { cause: err },
    );
  }
};
