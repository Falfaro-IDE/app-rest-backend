import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Exporta un archivo Excel con múltiples hojas.
 * @param hojas Objeto con nombre de hoja como clave y datos como array de objetos.
 * @param nombreArchivo Nombre del archivo Excel a guardar.
 */
export const exportarExcel = (
  hojas: Record<string, any[]>,
  nombreArchivo: string = "datos.xlsx"
) => {
  const wb = XLSX.utils.book_new();

  Object.entries(hojas).forEach(([nombreHoja, datos]) => {
    const ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
  });

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, nombreArchivo);
};
