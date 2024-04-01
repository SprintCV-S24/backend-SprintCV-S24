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

export const headingRouter = Router();

//Add an heading
//Note that the user field (which is part of HeadingType) in body is automatically populated by verifyToken middleware
headingRouter.post(
  "/",
  async (req: Request<any, any, HeadingType>, res: Response) => {
    try {
      const heading = await createHeading(req.body);
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
      const heading = await getHeadingById(
        req.body.user,
        req.params.headingId,
      );
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
      const heading = await deleteHeading(
        req.body.user,
        req.params.headingId,
      );
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