import { Router, type Request, type Response } from "express";
import { HttpError, HttpStatus } from "../utils/errors";
import {
  latexToPdf,
  uploadPdfToS3,
  handlePdfResponse,
  generateAndUpload,
} from "../controllers/latexPdfs.controller";
import { getAnyItem } from "../utils/getWithItemUnknown";
import { resumeItemTypes } from "../models/itemTypes";
import { BaseItem } from "../models/itemTypes";

export const pdfRouter = Router();

//needs a query param specifying the item type
pdfRouter.get(
  "/:itemId",
  async (
    req: Request<any, any, { user: string }, { type: string }>,
    res: Response,
  ) => {
    try {
      const clientETag = req.headers["if-none-match"];
      const result = await handlePdfResponse(
        `${req.body.user}/${req.params.itemId}.pdf`,
        res,
        clientETag,
      );
      if (result?.error == "NotFound") {
        //get from mongoose then generateAndUpload
        const itemType = parseInt(req.query.type) as resumeItemTypes;
        const item = (await getAnyItem(
          req.body.user,
          req.params.itemId,
          itemType,
        )) as BaseItem;
        if (item == null) {
          throw new HttpError(HttpStatus.BAD_REQUEST, "Item does not exist");
        }
        item.type = itemType;
        await generateAndUpload(item as BaseItem);
        await handlePdfResponse(
          `${req.body.user}/${req.params.itemId}.pdf`,
          res,
          clientETag,
        );
      }
    } catch (err: unknown) {
      console.log("err:", err);
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

pdfRouter.post(
  "/",
  async (req: Request<any, any, { latexCode: string }>, res: Response) => {
    try {
      const pdfBinary = await latexToPdf(req.body.latexCode);
      await uploadPdfToS3("", "testPdf", pdfBinary);
      res.status(HttpStatus.OK).send("ok");
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
