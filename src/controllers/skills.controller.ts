import { SkillsModel, type SkillsType } from "../models/skills.model";
import { HttpError, HttpStatus, checkMongooseErrors } from "../utils/errors";

export const createSkills = async (skillsFields: SkillsType) => {
  try {
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
      "Event creation failed",
      { cause: err },
    );
  }
};
