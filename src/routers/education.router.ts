/* v8 ignore start */
import { Router, type Request, type Response } from "express";
import {
  createEducation,
  getAllEducation,
  getEducationById,
  updateEducation,
  deleteEducation,
} from "../controllers/education.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type EducationType } from "../models/education.model";
import { generateAndUpload, deletePdfFromS3 } from "../controllers/latexPdfs.controller";
import { resumeItemTypes, BaseItem } from "../models/itemTypes";

export const educationRouter = Router();

//Add an education
//Note that the user field (which is part of EducationType) in body is automatically populated by verifyToken middleware
educationRouter.post(
  "/",
  async (req: Request<any, any, EducationType>, res: Response) => {
    try {
      const education = await createEducation(req.body);
      const educationDoc = education.toObject() as EducationType;
      await generateAndUpload({
        ...educationDoc,
        type: resumeItemTypes.EDUCATION,
      } as BaseItem);
      res.status(HttpStatus.OK).json(educationDoc);
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

//Get all education
educationRouter.get(
  "/",
  async (req: Request<any, any, EducationType>, res: Response) => {
    try {
      const education = await getAllEducation(req.body.user);
      res.status(HttpStatus.OK).json(education);
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

//Get a single education by id
educationRouter.get(
  "/:educationId",
  async (req: Request<any, any, EducationType>, res: Response) => {
    try {
      const education = await getEducationById(
        req.body.user,
        req.params.educationId,
      );
      res.status(HttpStatus.OK).json(education);
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

//Update an education
educationRouter.put(
  "/:educationId",
  async (req: Request<any, any, EducationType>, res: Response) => {
    try {
      const education = await updateEducation(
        req.body.user,
        req.params.educationId,
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
        const educationDoc = education.toObject() as EducationType;
        await generateAndUpload({
          ...educationDoc,
          type: resumeItemTypes.EDUCATION,
        } as BaseItem);
      }

      res.status(HttpStatus.OK).json(education);
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

//Delete an education
educationRouter.delete(
  "/:educationId",
  async (req: Request<any, any, EducationType>, res: Response) => {
    try {
      const education = await deleteEducation(
        req.body.user,
        req.params.educationId,
      );
	  await deletePdfFromS3(req.body.user, req.params.educationId);
      res.status(HttpStatus.OK).json(education);
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
