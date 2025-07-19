import { InsumoPreparado } from "../../../../../../models/clases/Insumo";
import { crearInsumoPost } from "../../../../../../services/insumoService";
import { importarInsumosPost } from "../../../../../../services/importacionService";
export interface ResultadoImportacion {
  success: boolean;
  mensaje: string;
}

export const importarInsumos = async (
  insumos: InsumoPreparado[]
): Promise<ResultadoImportacion> => {
  try {
    if (!insumos.length) {
      return {
        success: false,
        mensaje: "⚠️ No hay insumos para importar.",
      };
    }

    console.time("Importación de insumos");
    const response = await importarInsumosPost(insumos);
    console.timeEnd("Importación de insumos");

    if (response.codigo !== 1) {
      return {
        success: false,
        mensaje: `❌ Error al importar insumos: ${response.descripcion || "Error desconocido"}`,
      };
    }

    return {
      success: true,
      mensaje: "✅ Importación de insumos completada con éxito.",
    };
  } catch (error: any) {
    console.error("Error al importar insumos:", error);
    return {
      success: false,
      mensaje: error.message || "❌ Error durante la importación de insumos.",
    };
  }
};