import { Router, type Request, type Response } from "express";
import { HttpError, HttpStatus } from "../utils/errors";
import { latexToPdf, uploadPdfToS3, handlePdfResponse } from "../controllers/latexPdfs.controller";

export const pdfRouter = Router();

pdfRouter.get(
  "/",
  async (req: Request<any, any, { latexCode: string }>, res: Response) => {
    try {
      const clientETag = req.headers['if-none-match'];
      await handlePdfResponse("testPdf.pdf", res, clientETag);
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
