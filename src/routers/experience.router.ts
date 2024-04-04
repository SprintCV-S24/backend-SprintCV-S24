/* v8 ignore start */
import { Router, type Request, type Response } from "express";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type ExperienceType } from "../models/experience.model";
import { generateAndUpload } from "../controllers/latexPdfs.controller";
import { resumeItemTypes, BaseItem } from "../models/itemTypes";

export const experienceRouter = Router();

//Add an experience
//Note that the user field (which is part of ExperienceType) in body is automatically populated by verifyToken middleware
experienceRouter.post(
  "/",
  async (req: Request<any, any, ExperienceType>, res: Response) => {
    try {
      const experience = await createExperience(req.body);
      const experienceDoc = experience.toObject() as ExperienceType;
      await generateAndUpload({
        ...experienceDoc,
        type: resumeItemTypes.EXPERIENCE,
      } as BaseItem);
      res.status(HttpStatus.OK).json(experienceDoc);
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

//Get all experience
experienceRouter.get(
  "/",
  async (req: Request<any, any, ExperienceType>, res: Response) => {
    try {
      const experience = await getAllExperiences(req.body.user);
      res.status(HttpStatus.OK).json(experience);
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

//Get a single experience by id
experienceRouter.get(
  "/:experienceId",
  async (req: Request<any, any, ExperienceType>, res: Response) => {
    try {
      const experience = await getExperienceById(
        req.body.user,
        req.params.experienceId,
      );
      res.status(HttpStatus.OK).json(experience);
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

//Update an experience
experienceRouter.put(
  "/:experienceId",
  async (req: Request<any, any, ExperienceType>, res: Response) => {
    try {
      const experience = await updateExperience(
        req.body.user,
        req.params.experienceId,
        req.body,
      );

      const fieldsRequiringRerender = [
        "bullets",
        "title",
        "subtitle",
        "year",
        "location",
      ];
      const needsRerender = Object.keys(req.body).some((key) =>
        fieldsRequiringRerender.includes(key),
      );
      //a field has been updated that will change the item image
      if (needsRerender) {
        const experienceDoc = experience.toObject() as ExperienceType;
        await generateAndUpload({
          ...experienceDoc,
          type: resumeItemTypes.EXPERIENCE,
        } as BaseItem);
      }

      res.status(HttpStatus.OK).json(experience);
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

//Delete an experience
experienceRouter.delete(
  "/:experienceId",
  async (req: Request<any, any, ExperienceType>, res: Response) => {
    try {
      const experience = await deleteExperience(
        req.body.user,
        req.params.experienceId,
      );
      res.status(HttpStatus.OK).json(experience);
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
