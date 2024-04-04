import { Router } from "express";
import { skillRouter } from "./skills.router";
import { activitiesRouter } from "./activities.router";
import { educationRouter } from "./education.router";
import { experienceRouter } from "./experience.router";
import { headingRouter } from "./heading.router";
import { projectRouter } from "./project.router";
import { resumeRouter } from "./resume.router";
import { sectionHeadingRouter } from "./sectionHeading.router";
import { pdfRouter } from "./pdfs.router";

export const router = Router();

router.use("/skills", skillRouter);
router.use("/activities", activitiesRouter);
router.use("/education", educationRouter);
router.use("/experience", experienceRouter);
router.use("/headings", headingRouter);
router.use("/projects", projectRouter);
router.use("/resumes", resumeRouter);
router.use("/sectionHeadings", sectionHeadingRouter);
router.use("/pdfs", pdfRouter);
