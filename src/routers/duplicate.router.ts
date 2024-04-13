import { Router, type Request, type Response } from "express";
import { checkDuplicateItemName } from "../utils/checkDuplicates";
import { HttpError, HttpStatus } from "../utils/errors";

export const duplicateRouter = Router();

//Get if there is a duplicate
//Include excludedItemId query param to exclude an item
duplicateRouter.get(
  "/:itemName",
  async (
    req: Request<{ itemName: string }, any, any, { excludedItemId?: string }>,
    res: Response,
  ) => {
    try {
      const isDuplicate = await checkDuplicateItemName(
        req.body.user,
        req.params.itemName,
        req.query.excludedItemId || null,
      );
      res.status(HttpStatus.OK).json({ isDuplicate });
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
