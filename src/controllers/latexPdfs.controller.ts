import { HttpError, HttpStatus } from "../utils/errors";
import { s3Client } from "../config/s3Client";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { type Response } from "express";
import { generateLatex } from "../utils/latexString";
import { BaseItem } from "../models/itemTypes";

export const generateAndUpload = async (item: BaseItem) => {
  const latexCode = generateLatex(item);
  const pdfBuffer = await latexToPdf(latexCode);
  await uploadPdfToS3(item.user, item._id, pdfBuffer);
};

export const latexToPdf = async (latexCode: string) => {
  const formData = new FormData();
  formData.append("filename[]", "document.tex");
  formData.append("engine", "pdflatex");
  formData.append("return", "pdf");
  formData.append("filecontents[]", latexCode);

  const response = await fetch("https://texlive.net/cgi-bin/latexcgi", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let body = undefined;
    try {
      body = await response.text();
    } catch {}

    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Call to latex api failed",
      {
        cause: {
          status: response.status,
          statusText: response.statusText,
          body,
        },
      },
    );
  }

  const data = await response.arrayBuffer();
  return Buffer.from(data);
};

export const uploadPdfToS3 = async (
  user: string,
  itemId: string,
  data: Buffer,
) => {
  const bucketName = process.env.PDF_BUCKET_NAME;
  if (!bucketName) {
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "No bucket name provided",
    );
  }

  const objectName = `${user}/${itemId}`;

  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: `${objectName}.pdf`,
      Body: data,
      ContentType: "application/pdf",
    };

    const result = await s3Client.send(new PutObjectCommand(uploadParams));
    return result;
  } catch (err) {
    //rethrow HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "s3 object upload failed",
      { cause: err },
    );
  }
};

export const handlePdfResponse = async (
  objectName: string,
  res: Response,
  prevEtag: string | undefined = undefined,
) => {
  try {
    const bucketName = process.env.PDF_BUCKET_NAME;
    if (!bucketName) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "No bucket name provided",
      );
    }

    const params = {
      Bucket: bucketName,
      Key: objectName,
    };

    let headResponse;
    try {
      // get bare minimum http-header information
      headResponse = await s3Client.send(new HeadObjectCommand(params));
    } catch (err) {
      if (err instanceof Error && err.name == "NotFound") {
        return { error: "NotFound" };
      } else {
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "s3 object retrieval failed",
          { cause: err },
        );
      }
    }

    //avoid resending images if browser's cached version is up to date
    if (prevEtag && prevEtag == headResponse.ETag) {
      res.status(304).end();
      return;
    }

    res.set({
      "Content-Length": headResponse.ContentLength,
      "Content-Type": headResponse.ContentType,
      ETag: headResponse.ETag,
    });

    // Prepare cache headers
    const cacheLength = 1000 * 60 * 60 * 24 * 30; // about a month
    res.setHeader("Cache-Control", `public, max-age=${cacheLength / 1000}`);
    res.setHeader("Expires", new Date(Date.now() + cacheLength).toUTCString());

    // get the object data and stream it
    const response = await s3Client.send(new GetObjectCommand(params));
    const stream = response.Body as Readable;

    if (stream == null) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "S3 get object response body is null",
      );
    }
    res.type("application/pdf");
    stream.on("data", (chunk) => res.write(chunk));
    stream.once("end", () => {
      res.end();
    });
    stream.once("error", () => {
      res.end();
    });
    return;
  } catch (err) {
    //rethrow HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "s3 object retrieval failed",
      { cause: err },
    );
  }
};

export const deletePdfFromS3 = async (user: string, itemId: string) => {
  try {
    const bucketName = process.env.PDF_BUCKET_NAME;
    if (!bucketName) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "No bucket name provided",
      );
    }

    //list all w/ user/itemId in case we have multiple images of different templates
    const listParams = {
      Bucket: bucketName,
      Prefix: `${user}/${itemId}`,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams),
    );

    if (listedObjects.Contents == null || listedObjects.Contents.length === 0) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "No s3 objects found to delete",
      );
    }

    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
      },
    };

    const deleteResult = await s3Client.send(
      new DeleteObjectsCommand(deleteParams),
    );
    if (deleteResult.Errors != null) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Some objects failed to delete:	${deleteResult.Errors}`,
      );
    }
  } catch (err) {
    //rethrow HttpErrors
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "S3 object deletion failed",
      { cause: err },
    );
  }
};
