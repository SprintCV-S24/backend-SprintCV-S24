/* v8 ignore start */
import { Router, type Request, type Response } from "express";
import {
  createSectionHeading,
  getAllSectionHeadings,
  getSectionHeadingById,
  updateSectionHeading,
  deleteSectionHeading,
} from "../controllers/sectionHeading.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type SectionHeadingType } from "../models/sectionHeading.model";
import { generateAndUpload, deletePdfFromS3 } from "../controllers/latexPdfs.controller";
import { resumeItemTypes, BaseItem } from "../models/itemTypes";

export const sectionHeadingRouter = Router();

//Add an sectionHeading
//Note that the user field (which is part of SectionHeadingType) in body is automatically populated by verifyToken middleware
sectionHeadingRouter.post(
  "/",
  async (req: Request<any, any, SectionHeadingType>, res: Response) => {
    try {
      const sectionHeading = await createSectionHeading(req.body);
      const sectionHeadingDoc = sectionHeading.toObject() as SectionHeadingType;
      await generateAndUpload({
        ...sectionHeadingDoc,
        type: resumeItemTypes.SECTIONHEADING,
      } as BaseItem);
      res.status(HttpStatus.OK).json(sectionHeadingDoc);
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

//Get all sectionHeading
sectionHeadingRouter.get(
  "/",
  async (req: Request<any, any, SectionHeadingType>, res: Response) => {
    try {
      const sectionHeading = await getAllSectionHeadings(req.body.user);
      res.status(HttpStatus.OK).json(sectionHeading);
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

//Get a single sectionHeading by id
sectionHeadingRouter.get(
  "/:sectionHeadingId",
  async (req: Request<any, any, SectionHeadingType>, res: Response) => {
    try {
      const sectionHeading = await getSectionHeadingById(
        req.body.user,
        req.params.sectionHeadingId,
      );
      res.status(HttpStatus.OK).json(sectionHeading);
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

//Update an sectionHeading
sectionHeadingRouter.put(
  "/:sectionHeadingId",
  async (req: Request<any, any, SectionHeadingType>, res: Response) => {
    try {
      const sectionHeading = await updateSectionHeading(
        req.body.user,
        req.params.sectionHeadingId,
        req.body,
      );

      const fieldsRequiringRerender = ["title"];
      const needsRerender = Object.keys(req.body).some((key) =>
        fieldsRequiringRerender.includes(key),
      );
      //a field has been updated that will change the item image
      if (needsRerender) {
        const sectionHeadingDoc =
          sectionHeading.toObject() as SectionHeadingType;
        await generateAndUpload({
          ...sectionHeadingDoc,
          type: resumeItemTypes.SECTIONHEADING,
        } as BaseItem);
      }

      res.status(HttpStatus.OK).json(sectionHeading);
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

//Delete an sectionHeading
sectionHeadingRouter.delete(
  "/:sectionHeadingId",
  async (req: Request<any, any, SectionHeadingType>, res: Response) => {
    try {
      const sectionHeading = await deleteSectionHeading(
        req.body.user,
        req.params.sectionHeadingId,
      );
	  await deletePdfFromS3(req.body.user, req.params.sectionHeadingId);
      res.status(HttpStatus.OK).json(sectionHeading);
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
