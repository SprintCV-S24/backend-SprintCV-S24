import { Router } from "express";
import { skillRouter } from "./skills.router";
import { activitiesRouter } from "./activities.router";
import { educationRouter } from "./education.router";

export const router = Router();

router.use("/skills", skillRouter);
router.use("/activities", activitiesRouter);
router.use("/education", educationRouter);
