import mongoose from "mongoose";
import { ActivitiesModel } from "../models/activities.model";
import { EducationModel } from "../models/education.model";
import { ExperienceModel } from "../models/experience.model";
import { HeadingModel } from "../models/heading.model";
import { ProjectModel } from "../models/project.model";
import { SectionHeadingModel } from "../models/sectionHeading.model";
import { SkillsModel } from "../models/skills.model";

export const checkDuplicateItemName = async (value: string, excludedId: string | null = null): Promise<boolean> => {
  const field = "itemName";
  const models = [
    ActivitiesModel,
    EducationModel,
    ExperienceModel,
    HeadingModel,
    ProjectModel,
    SectionHeadingModel,
    SkillsModel,
  ];

  // Check each model for the count of documents with the specified itemName value
  const checks = models.map((model) =>
    model.countDocuments({ [field]: value, '_id': { $ne: excludedId } }).exec(),
  );

  // Await all checks to resolve
  const results = await Promise.all(checks);

  // Sum the counts from all models
  const totalDuplicates = results.reduce((acc, count) => acc + count, 0);

  // If totalDuplicates is greater than 0, a duplicate exists
  return totalDuplicates > 0;
};
