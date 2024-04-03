import { ExperienceType } from "../models/experience.model";
import { HeadingType } from "../models/heading.model";
import { EducationType } from "../models/education.model";
import { ProjectType } from "../models/project.model";
import { SkillsType } from "../models/skills.model";
import { ActivitiesType } from "../models/activities.model";
import { SectionHeadingType } from "../models/sectionHeading.model";

export enum resumeItemTypes {
	EDUCATION,
	EXPERIENCE,
	ACTIVITY,
	HEADING,
	PROJECT,
	SECTIONHEADING,
	SKILL,
}

export type BaseItem =
  | (ActivitiesType & {type: resumeItemTypes.ACTIVITY})
  | (EducationType & {type: resumeItemTypes.EDUCATION})
  | (ExperienceType & {type: resumeItemTypes.EXPERIENCE})
  | (HeadingType & {type: resumeItemTypes.HEADING})
  | (ProjectType & {type: resumeItemTypes.PROJECT})
  | (SkillsType & {type: resumeItemTypes.SKILL})
  | (SectionHeadingType & {type: resumeItemTypes.SECTIONHEADING});

