import { Router, type Request, type Response } from "express";
import { HttpError, HttpStatus } from "../utils/errors";
import { latexToPdf, uploadPdfToS3 } from "../controllers/latexPdfs.controller";

export const pdfRouter = Router();

