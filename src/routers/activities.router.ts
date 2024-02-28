import { Router, type Request, type Response } from "express";
import {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../controllers/activities.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type ActivitiesType } from "../models/activities.model";

export const activitiesRouter = Router();

//Note that the user field (which is part of activitiesType) in body is automatically populated by verifyToken middleware
activitiesRouter.post(
  "/",
  async (req: Request<any, any, ActivitiesType>, res: Response) => {
    try {
      const activity = await createActivity(req.body);
      res.status(HttpStatus.OK).json(activity);
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

activitiesRouter.get(
  "/",
  async (req: Request<any, any, ActivitiesType>, res: Response) => {
    try {
      const activities = await getAllActivities(req.body.user);
      res.status(HttpStatus.OK).json(activities);
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

activitiesRouter.get(
  "/:activityId",
  async (req: Request<any, any, ActivitiesType>, res: Response) => {
    try {
      const activity = await getActivityById(req.body.user, req.params.activityId);
      res.status(HttpStatus.OK).json(activity);
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

activitiesRouter.put(
  "/:activityId",
  async (req: Request<any, any, ActivitiesType>, res: Response) => {
    try {
      const activity = await updateActivity(req.body.user, req.params.activityId, req.body);
      res.status(HttpStatus.OK).json(activity);
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

activitiesRouter.delete(
  "/:activityId",
  async (req: Request<any, any, ActivitiesType>, res: Response) => {
    try {
      const activity = await deleteActivity(req.body.user, req.params.activityId);
      res.status(HttpStatus.OK).json(activity);
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
