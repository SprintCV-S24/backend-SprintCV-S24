/* v8 ignore start */
import { Router, type Request, type Response } from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../controllers/skills.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type SkillsType } from "../models/skills.model";

export const skillRouter = Router();

//Add an skill
//Note that the user field (which is part of SkillsType) in body is automatically populated by verifyToken middleware
skillRouter.post(
  "/",
  async (req: Request<any, any, SkillsType>, res: Response) => {
    try {
      const skill = await createSkill(req.body);
      res.status(HttpStatus.OK).json(skill);
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

//Get all skill
skillRouter.get(
  "/",
  async (req: Request<any, any, SkillsType>, res: Response) => {
    try {
      const skill = await getAllSkills(req.body.user);
      res.status(HttpStatus.OK).json(skill);
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

//Get a single skill by id
skillRouter.get(
  "/:skillId",
  async (req: Request<any, any, SkillsType>, res: Response) => {
    try {
      const skill = await getSkillById(
        req.body.user,
        req.params.skillId,
      );
      res.status(HttpStatus.OK).json(skill);
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

//Update an skill
skillRouter.put(
  "/:skillId",
  async (req: Request<any, any, SkillsType>, res: Response) => {
    try {
      const skill = await updateSkill(
        req.body.user,
        req.params.skillId,
        req.body,
      );
      res.status(HttpStatus.OK).json(skill);
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

//Delete an skill
skillRouter.delete(
  "/:skillId",
  async (req: Request<any, any, SkillsType>, res: Response) => {
    try {
      const skill = await deleteSkill(
        req.body.user,
        req.params.skillId,
      );
      res.status(HttpStatus.OK).json(skill);
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
/* v8 ignore stop */
