import { Router } from "express";
import { skillsRouter } from "./skills.router";
import { activitiesRouter } from "./activities.router";

export const router = Router();

router.use("/skills", skillsRouter);
router.use("/activities", activitiesRouter);
