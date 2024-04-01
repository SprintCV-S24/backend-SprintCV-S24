/* v8 ignore start */
import { Router, type Request, type Response } from "express";
import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type resumeType } from "../models/resume.model";

export const resumeRouter = Router();

//Add an resume
//Note that the user field (which is part of resumesType) in body is automatically populated by verifyToken middleware
resumeRouter.post(
  "/",
  async (req: Request<any, any, resumeType>, res: Response) => {
    try {
      const resume = await createResume(req.body);
      res.status(HttpStatus.OK).json(resume);
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

//Get all resumes
resumeRouter.get(
  "/",
  async (req: Request<any, any, resumeType>, res: Response) => {
    try {
      const resume = await getAllResumes(req.body.user);
      res.status(HttpStatus.OK).json(resume);
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

//Get a single resume by id
resumeRouter.get(
  "/:resumeId",
  async (req: Request<any, any, resumeType>, res: Response) => {
    try {
      const resume = await getResumeById(
        req.body.user,
        req.params.resumeId,
      );
      res.status(HttpStatus.OK).json(resume);
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

//Update an resume
resumeRouter.put(
  "/:resumeId",
  async (req: Request<any, any, resumeType>, res: Response) => {
    try {
      const resume = await updateResume(
        req.body.user,
        req.params.resumeId,
        req.body,
      );
      res.status(HttpStatus.OK).json(resume);
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

//Delete an resume
resumeRouter.delete(
  "/:resumeId",
  async (req: Request<any, any, resumeType>, res: Response) => {
    try {
      const resume = await deleteResume(
        req.body.user,
        req.params.resumeId,
      );
      res.status(HttpStatus.OK).json(resume);
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
