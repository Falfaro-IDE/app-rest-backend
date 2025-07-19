
export const descargarFormato = (tipoImportacion: "productos" | "insumos") => {
  const archivo = tipoImportacion === "productos" ? "/archivos/Productos.xlsx" : "/archivos/Insumos.xlsx";
  const link = document.createElement("a");
  link.href = archivo;
  link.download = archivo.split("/").pop()!;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
