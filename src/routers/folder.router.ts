import { Router, type Request, type Response } from "express";
import {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} from "../controllers/folder.controller";
import { HttpError, HttpStatus } from "../utils/errors";
import { type folderType } from "../models/folder.model";

export const folderRouter = Router();

//Add an folder
//Note that the user field (which is part of foldersType) in body is automatically populated by verifyToken middleware
folderRouter.post(
  "/",
  async (req: Request<any, any, folderType>, res: Response) => {
    try {
      const folder = await createFolder(req.body);
      res.status(HttpStatus.OK).json(folder);
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

//Get all folders
folderRouter.get(
  "/",
  async (req: Request<any, any, folderType>, res: Response) => {
    try {
      const folder = await getAllFolders(req.body.user);
      res.status(HttpStatus.OK).json(folder);
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

//Get a single folder by id
folderRouter.get(
  "/:folderId",
  async (req: Request<any, any, folderType>, res: Response) => {
    try {
      const folder = await getFolderById(
        req.body.user,
        req.params.folderId,
      );
      res.status(HttpStatus.OK).json(folder);
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

//Update an folder
folderRouter.put(
  "/:folderId",
  async (req: Request<any, any, folderType>, res: Response) => {
    try {
      const folder = await updateFolder(
        req.body.user,
        req.params.folderId,
        req.body,
      );
      res.status(HttpStatus.OK).json(folder);
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

//Delete an folder
folderRouter.delete(
  "/:folderId",
  async (req: Request<any, any, folderType>, res: Response) => {
    try {
      const folder = await deleteFolder(
        req.body.user,
        req.params.folderId,
      );
      res.status(HttpStatus.OK).json(folder);
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
