import { ActivitiesModel } from "../models/activities.model";
import { EducationModel } from "../models/education.model";
import { ExperienceModel } from "../models/experience.model";
import { HeadingModel } from "../models/heading.model";
import { ProjectModel } from "../models/project.model";
import { SectionHeadingModel } from "../models/sectionHeading.model";
import { SkillsModel } from "../models/skills.model";
import { resumeItemTypes } from "../models/itemTypes";
import { HttpError, HttpStatus } from "./errors";

export const getAnyItem = async (
  user: string,
  itemId: string,
  type: resumeItemTypes,
) => {
  switch (type) {
    case resumeItemTypes.EDUCATION:
      return await EducationModel.findOne({
        user: user,
        _id: itemId,
      });

    case resumeItemTypes.EXPERIENCE:
      return await ExperienceModel.findOne({
        user: user,
        _id: itemId,
      });

    case resumeItemTypes.ACTIVITY:
      return await ActivitiesModel.findOne({
        user: user,
        _id: itemId,
      });

    case resumeItemTypes.HEADING:
      return await HeadingModel.findOne({
        user: user,
        _id: itemId,
      });

    case resumeItemTypes.PROJECT:
      return await ProjectModel.findOne({
        user: user,
        _id: itemId,
      });

    case resumeItemTypes.SECTIONHEADING:
      return await SectionHeadingModel.findOne({
        user: user,
        _id: itemId,
      });

    case resumeItemTypes.SKILL:
      return await SkillsModel.findOne({
        user: user,
        _id: itemId,
      });
    default:
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Invalid or no item type provided",
      );
  }
};
