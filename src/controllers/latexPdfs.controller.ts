import { HttpError, HttpStatus } from "../utils/errors";

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
	return data;
};
