/* v8 ignore start */
import { Router, type Request, type Response } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type ProjectType } from "../models/project.model";

export const projectRouter = Router();

//Add an project
//Note that the user field (which is part of ProjectType) in body is automatically populated by verifyToken middleware
projectRouter.post(
  "/",
  async (req: Request<any, any, ProjectType>, res: Response) => {
    try {
      const project = await createProject(req.body);
      res.status(HttpStatus.OK).json(project);
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

//Get all project
projectRouter.get(
  "/",
  async (req: Request<any, any, ProjectType>, res: Response) => {
    try {
      const project = await getAllProjects(req.body.user);
      res.status(HttpStatus.OK).json(project);
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

//Get a single project by id
projectRouter.get(
  "/:projectId",
  async (req: Request<any, any, ProjectType>, res: Response) => {
    try {
      const project = await getProjectById(
        req.body.user,
        req.params.projectId,
      );
      res.status(HttpStatus.OK).json(project);
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

//Update an project
projectRouter.put(
  "/:projectId",
  async (req: Request<any, any, ProjectType>, res: Response) => {
    try {
      const project = await updateProject(
        req.body.user,
        req.params.projectId,
        req.body,
      );
      res.status(HttpStatus.OK).json(project);
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

//Delete an project
projectRouter.delete(
  "/:projectId",
  async (req: Request<any, any, ProjectType>, res: Response) => {
    try {
      const project = await deleteProject(
        req.body.user,
        req.params.projectId,
      );
      res.status(HttpStatus.OK).json(project);
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