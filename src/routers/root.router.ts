import { Router } from "express";
import { skillsRouter } from "./skills.router";
import { activitiesRouter } from "./activities.router";
import { educationRouter } from "./education.router";

export const router = Router();

router.use("/skills", skillsRouter);
router.use("/activities", activitiesRouter);
router.use("/education", educationRouter);
