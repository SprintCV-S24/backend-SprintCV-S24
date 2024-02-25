import { SkillsModel, type SkillsType } from "../models/skills.model";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";
import { checkDuplicateItemName } from "../utils/checkDuplicates";

export const createSkills = async (skillsFields: SkillsType) => {
  try {
		if(await checkDuplicateItemName(skillsFields.itemName)){
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
