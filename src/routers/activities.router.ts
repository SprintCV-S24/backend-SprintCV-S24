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

/**
 * Route to add a new activity. The user field in the activity data is populated by the verifyToken middleware.
 */
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

/**
 * Route to get all activities for a user.
 */
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

/**
 * Route to get a specific activity by its ID.
 */
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

/**
 * Route to update a specific activity by its ID.
 */
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

/**
 * Route to delete a specific activity by its ID.
 */
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
