/* v8 ignore start */
import { Router, type Request, type Response } from "express";
import {
  createHeading,
  getAllHeadings,
  getHeadingById,
  updateHeading,
  deleteHeading,
} from "../controllers/heading.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type HeadingType } from "../models/heading.model";
import { generateAndUpload } from "../controllers/latexPdfs.controller";
import { resumeItemTypes, BaseItem } from "../models/itemTypes";

export const headingRouter = Router();

//Add an heading
//Note that the user field (which is part of HeadingType) in body is automatically populated by verifyToken middleware
headingRouter.post(
  "/",
  async (req: Request<any, any, HeadingType>, res: Response) => {
    try {
      const heading = await createHeading(req.body);
      const headingDoc = heading.toObject() as HeadingType;
      await generateAndUpload({
        ...headingDoc,
        type: resumeItemTypes.HEADING,
      } as BaseItem);
      res.status(HttpStatus.OK).json(headingDoc);
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

//Get all heading
headingRouter.get(
  "/",
  async (req: Request<any, any, HeadingType>, res: Response) => {
    try {
      const heading = await getAllHeadings(req.body.user);
      res.status(HttpStatus.OK).json(heading);
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

//Get a single heading by id
headingRouter.get(
  "/:headingId",
  async (req: Request<any, any, HeadingType>, res: Response) => {
    try {
      const heading = await getHeadingById(req.body.user, req.params.headingId);
      res.status(HttpStatus.OK).json(heading);
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

//Update an heading
headingRouter.put(
  "/:headingId",
  async (req: Request<any, any, HeadingType>, res: Response) => {
    try {
      const heading = await updateHeading(
        req.body.user,
        req.params.headingId,
        req.body,
      );

      const fieldsRequiringRerender = [
        "name",
		"items",
      ];
      const needsRerender = Object.keys(req.body).some((key) =>
        fieldsRequiringRerender.includes(key),
      );
      //a field has been updated that will change the item image
      if (needsRerender) {
        const headingDoc = heading.toObject() as HeadingType;
        await generateAndUpload({
          ...headingDoc,
          type: resumeItemTypes.HEADING,
        } as BaseItem);
      }

      res.status(HttpStatus.OK).json(heading);
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

//Delete an heading
headingRouter.delete(
  "/:headingId",
  async (req: Request<any, any, HeadingType>, res: Response) => {
    try {
      const heading = await deleteHeading(req.body.user, req.params.headingId);
      res.status(HttpStatus.OK).json(heading);
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
