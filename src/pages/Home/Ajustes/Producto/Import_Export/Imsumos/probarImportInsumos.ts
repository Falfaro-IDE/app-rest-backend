import * as XLSX from "xlsx";
import {obtenerCategoriasGet,} from "../../../../../../services/productoServices";
import { EstadoProducto } from "../../../../../../models/clases/concepts";
import { obtenerInsumosGet } from "../../../../../../services/insumoService";

const columnasEsperadasInsumos = [
  "CODIGO",
  "CATEGORIA",
  "NOMBRE",
  "UNIDAD DE MEDIDA",
  "COSTO",
  "STOCK MINIMO",
];

export const procesarArchivoInsumos = async (archivo: File,unidadesMedida: any[]): Promise<{insumos: any[]; mensaje: string;errores: string[];}> => {
  try {
    const data = await leerArchivoComoArrayBuffer(archivo);
    const workbook = XLSX.read(data, { type: "array" });
    const hojaInsumos = workbook.Sheets[workbook.SheetNames[0]];

    if (!hojaInsumos) {
      return {
        insumos: [],
        mensaje: "El archivo no contiene hojas válidas.",
        errores: ["El archivo no contiene hojas válidas."],
      };
    }

    const insumosFilas = XLSX.utils.sheet_to_json(hojaInsumos, {
      header: 0,
    }) as any[];

    const estructuraOk = validarEstructuraExcelInsumos(insumosFilas);
    if (!estructuraOk.valido) {
      return {
        insumos: [],
        mensaje: estructuraOk.mensaje,
        errores: [estructuraOk.mensaje],
      };
    }

    const resultado = await prepararInsumosParaImportar(
      insumosFilas,
      unidadesMedida
    );

    if (resultado.errores.length > 0) {
      return {
        insumos: [],
        mensaje: "Errores encontrados:\n" + resultado.errores.join("\n"),
        errores: resultado.errores,
      };
    }

    return {
      insumos: resultado.insumos,
      mensaje:
        "✅ Archivo de insumos procesado correctamente. Todo está listo para importar.",
      errores: [],
    };
  } catch (error) {
    console.error("Error procesando el archivo de insumos:", error);
    return {
      insumos: [],
      mensaje: "❌ Error al procesar el archivo de insumos.",
      errores: ["Error técnico al procesar el archivo."],
    };
  }
};

// Leer archivo como ArrayBuffer
const leerArchivoComoArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Validar estructura
const validarEstructuraExcelInsumos = (filas: any[]): {valido: boolean;mensaje: string;} => {
  if (!Array.isArray(filas) || filas.length === 0) {
    return {
      valido: false,
      mensaje: "La hoja de insumos está vacía o mal formateada.",
    };
  }

  const encabezado = Object.keys(filas[0]);
  const faltantes = columnasEsperadasInsumos.filter(
    (col) => !encabezado.includes(col)
  );
  if (faltantes.length > 0) {
    return {
      valido: false,
      mensaje: `Faltan columnas en la hoja de insumos: ${faltantes.join(", ")}`,
    };
  }

  return { valido: true, mensaje: "" };
};

// Preparar insumos
const prepararInsumosParaImportar = async (filas: any[],unidadesMedida: any[]): Promise<{insumos: any[];errores: string[];}> => {
  const errores: string[] = [];
  const insumos: any[] = [];
  const codigosVistos: Set<string> = new Set();

  // Obtener todas las categorías una vez
  const categoriasResponse = await obtenerCategoriasGet();
  const categoriasMap = new Map<string, any>();

  if (categoriasResponse.codigo === 1) {
    for (const cat of categoriasResponse.objeto) {
      categoriasMap.set(cat.nombre.toLowerCase(), cat);
    }
  }

  await Promise.all(
    filas.map(async (fila, index) => {
      try {
        const codigo = fila["CODIGO"];
        const nombre = fila["NOMBRE"];
        const categoriaNombre = fila["CATEGORIA"];
        const unidadNombre = fila["UNIDAD DE MEDIDA"];
        const costo = parseFloat(fila["COSTO"]);
        const stockMinimo = parseFloat(fila["STOCK MINIMO"]);

        if (!codigo || !nombre || !categoriaNombre || !unidadNombre) {
          throw new Error("Campos obligatorios vacíos");
        }

        if (isNaN(costo) || isNaN(stockMinimo)) {
          throw new Error("Costo o Stock Mínimo inválido");
        }

        if (codigosVistos.has(codigo)) {
          throw new Error(`Código duplicado en el archivo: "${codigo}"`);
        }
        codigosVistos.add(codigo);

        // Verificar si ya existe en el sistema
        const existente = await obtenerInsumosGet({ codigo });
        if (existente.objeto?.length > 0) {
          throw new Error(`El código "${codigo}" ya existe en el sistema`);
        }

        // Categoría: crear si no existe
        const categoriaKey = categoriaNombre.toLowerCase();
        let categoria = categoriasMap.get(categoriaKey);
        if (!categoria) {
          categoria = await crearCategoria({ nombre: categoriaNombre });
          categoriasMap.set(categoriaKey, categoria);
        }

        // Unidad de medida
        const unidad = unidadesMedida.find(
          (u) => u.con_descripcion.toLowerCase() === unidadNombre.toLowerCase()
        );
        if (!unidad) {
          throw new Error(`Unidad de medida inválida: "${unidadNombre}"`);
        }

        const ahora = new Date();
        insumos.push({
          codigo,
          nombre,
          categoria_id: categoria.id,
          unidad_medida: unidad.con_correlativo,
          costo_unitario: costo,
          stock_minimo: stockMinimo,
          estado: EstadoProducto.Activo,
          fecha_creacion: ahora.toISOString().split("T")[0],
          hora_creacion: ahora.toLocaleTimeString("es-PE", {
            hour12: false,
          }),
        });
        console.log(insumos);
        
      } catch (error) {
        errores.push(`Fila ${index + 2}: ${(error as Error).message}`);
      }
    })
  );

  return { insumos, errores };
};

// Simula creación de categoría
async function crearCategoria(data: { nombre: string }): Promise<any> {
  return {
    id: Math.floor(Math.random() * 1000),
    ...data,
  };
}
