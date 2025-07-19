import { PresentacionPreparada, ProductoPreparado } from "../../../../../../models/clases/Producto";
import { importarProductosPresentacionesPost } from "../../../../../../services/importacionService";

interface ResultadoImportacion {
  success: boolean;
  mensaje: string;
}

export async function importarProductosYPresentaciones(
  productos: ProductoPreparado[],
  presentaciones: PresentacionPreparada[]
): Promise<ResultadoImportacion> {
  try {
    console.time("Importación completa");

    const response = await importarProductosPresentacionesPost({
      productos,
      presentaciones,
    });

    console.timeEnd("Importación completa");

    if (response.codigo !== 1) {
      throw new Error(response.descripcion || "Error durante la importación.");
    }

    return {
      success: true,
      mensaje: "✅ Importación completada con éxito.",
    };
  } catch (error: any) {
    console.error("Error durante la importación:", error);
    return {
      success: false,
      mensaje: error.message || "Error durante la importación.",
    };
  }
}
