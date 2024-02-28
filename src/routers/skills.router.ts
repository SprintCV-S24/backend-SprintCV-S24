import { Router, type Request, type Response } from "express";
import { createSkill } from "../controllers/skills.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type SkillsType } from "../models/skills.model";

export const skillsRouter = Router();

//Note that the user field (which is part of skillsType) in body is automatically populated by verifyToken middleware
skillsRouter.post(
  "/",
  async (req: Request<any, any, SkillsType>, res: Response) => {
    try {
      const skills = await createSkill(req.body);
      res.status(HttpStatus.OK).json(skills);
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        res.status(err.errorCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: "An unknown error occurred" });
      }
    }
  },
);
