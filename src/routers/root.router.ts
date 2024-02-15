import { Router } from "express";
import { skillsRouter } from "./skills.router";

export const router = Router();

router.use("/skills", skillsRouter);
