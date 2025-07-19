import React from "react";

interface PdfViewerProps {
  base64PDF: string;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  base64PDF,
  width = 400,
  height = 400,
  left = 100,
  top = 100,
}) => {
  React.useEffect(() => {
    if (!base64PDF) return;

    const byteCharacters = atob(base64PDF);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(blob);

    const pdfWindow = window.open(
      "",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (pdfWindow) {
      pdfWindow.document.write(`
        <html>
          <head>
            <title>Precuenta</title>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                height: 100%;
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>
          <body>
            <iframe src="${pdfUrl}"></iframe>
          </body>
        </html>
      `);
      pdfWindow.document.close();
    } else {
      alert("El navegador bloqueó la ventana emergente.");
    }
  }, [base64PDF]);

  return null; // No renderiza nada en pantalla, solo ejecuta el efecto
};

export default PdfViewer;
