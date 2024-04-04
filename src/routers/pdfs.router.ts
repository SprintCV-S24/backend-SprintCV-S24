import { Router, type Request, type Response } from "express";
import { HttpError, HttpStatus } from "../utils/errors";
import { latexToPdf } from "../controllers/latexPdfs.controller";

export const pdfRouter = Router();

