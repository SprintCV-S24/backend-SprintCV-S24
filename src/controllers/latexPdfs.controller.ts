import { HttpError, HttpStatus } from "../utils/errors";
import { s3Client } from "../config/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

export const uploadPdfToS3 = async (objectName: string, data: Buffer) => {
	const bucketName = process.env.PDF_BUCKET_NAME;
	if (!bucketName) {
		throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "No bucket name provided",
    );
	}

	try {
			const uploadParams = {
					Bucket: bucketName,
					Key: `${objectName}.pdf`,
					Body: data,
					ContentType: 'application/pdf',
			};

			const result = await s3Client.send(new PutObjectCommand(uploadParams));
			console.log('File uploaded successfully', result);
			return result;
	} catch (error) {
			console.error("Error fetching PDF or uploading to S3:", error);
			throw error;
	}
}
