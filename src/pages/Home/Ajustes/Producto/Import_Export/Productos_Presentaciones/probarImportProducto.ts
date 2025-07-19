import * as XLSX from "xlsx";
import { obtenerAreaProduccionGet } from "../../../../../../services/areaProduccion";
import {
  obtenerCategoriasGet,
  obtenerPresentacionesGet,
} from "../../../../../../services/productoServices";

import {
  EstadoProducto,
  TipoProducto,
} from "../../../../../../models/clases/concepts";
import {
  AreaProduccion,
  Categoria,
  PresentacionPreparada,
  ProductoPreparado,
} from "../../../../../../models/clases/Producto";

const columnasEsperadasProductos = [
  "CODIGO",
  "CATEGORIA",
  "NOMBRE",
  "AREA DE PRODUCCION",
  "TIPO",
];

const columnasEsperadasPresentaciones = [
  "CODIGO PRODUCTO",
  "CODIGO PRESENTACION",
  "DESCRIPCION",
  "PRECIO",
  "COSTO",
  "RECETA",
  "AGREGADOS",
  "CONTROL STOCK",
  "STOCK MIN",
];

const fechaActual = new Date();
const fecha_creacion = fechaActual.toISOString().split("T")[0];
const hora_creacion = fechaActual.toLocaleTimeString("es-PE", {
  hour12: false,
});

export async function procesarArchivoProductos(archivo: File): Promise<{
  productos: ProductoPreparado[];
  presentaciones: PresentacionPreparada[];
  categoriasFaltantes: string[];
  errores: string[];
}> {
  const errores: string[] = [];
  let productos: ProductoPreparado[] = [];
  let presentaciones: PresentacionPreparada[] = [];
  let categoriasFaltantes: string[] = [];

  try {
    const data = await archivo.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
    const hojaProductos = workbook.Sheets["Productos"];
    const hojaPresentaciones = workbook.Sheets["Presentaciones"];

    if (!hojaProductos || !hojaPresentaciones) {
      errores.push(
        "El archivo debe contener las hojas 'Productos' y 'Presentaciones'"
      );
      return {
        productos: [],
        presentaciones: [],
        categoriasFaltantes: [],
        errores,
      };
    }

    const productosFilas = XLSX.utils.sheet_to_json(hojaProductos, {
      header: 0,
    }) as any[];
    const presentacionesFilas = XLSX.utils.sheet_to_json(hojaPresentaciones, {
      header: 0,
    }) as any[];

    const estructuraValida = validarEstructura(
      productosFilas,
      presentacionesFilas,
      errores
    );
    if (!estructuraValida) {
      return {
        productos: [],
        presentaciones: [],
        categoriasFaltantes: [],
        errores,
      };
    }

    const resultadoProductos = await prepararProductosParaImportar(
      productosFilas
    );
    productos = resultadoProductos.productos;
    categoriasFaltantes = resultadoProductos.categoriasFaltantes;
    errores.push(...resultadoProductos.errores);

    const codigosValidos = productos.map((p) => p.codigo);
    const resultadoPresentaciones = await prepararPresentacionesParaImportar(
      presentacionesFilas,
      codigosValidos
    );
    presentaciones = resultadoPresentaciones.presentaciones;
    errores.push(...resultadoPresentaciones.errores);

    return { productos, presentaciones, categoriasFaltantes, errores };
  } catch (e) {
    console.error(e);
    errores.push("Error inesperado al procesar el archivo.");
    return {
      productos: [],
      presentaciones: [],
      categoriasFaltantes: [],
      errores,
    };
  }
}

function validarEstructura(
  productos: ProductoPreparado[],
  presentaciones: PresentacionPreparada[],
  errores: string[]
): boolean {
  const verificarColumnasFaltantes = (
    datos: any[],
    columnasEsperadas: string[],
    nombreHoja: string
  ) => {
    if (!datos.length) {
      errores.push(`La hoja '${nombreHoja}' está vacía.`);
      return false;
    }
    const encabezados = new Set(Object.keys(datos[0]));
    const faltantes = columnasEsperadas.filter((col) => !encabezados.has(col));
    if (faltantes.length) {
      errores.push(
        `Faltan columnas en '${nombreHoja}': ${faltantes.join(", ")}`
      );
    }
    return faltantes.length === 0;
  };
  const estructuraProductosOk = verificarColumnasFaltantes(
    productos,
    columnasEsperadasProductos,
    "Productos"
  );
  const estructuraPresentacionesOk = verificarColumnasFaltantes(
    presentaciones,
    columnasEsperadasPresentaciones,
    "Presentaciones"
  );
  return estructuraProductosOk && estructuraPresentacionesOk;
}

async function prepararProductosParaImportar(
  filas: any[]
): Promise<{
  errores: string[];
  productos: ProductoPreparado[];
  categoriasFaltantes: string[];
}> {
  const errores: string[] = [];
  const productos: ProductoPreparado[] = [];
  const categoriasFaltantes: string[] = [];

  const categoriasResponse = await obtenerCategoriasGet();
  const categorias: Categoria[] = categoriasResponse.objeto;
  if (!categorias) {
    errores.push("No se pudieron obtener las categorías desde el servidor.");
    return { errores, productos: [], categoriasFaltantes: [] };
  }

  const areasProduccionResponse = await obtenerAreaProduccionGet();
  const areas: AreaProduccion[] = areasProduccionResponse.objeto;
  if (!areas) {
    errores.push(
      "No se pudieron obtener las áreas de producción desde el servidor."
    );
    return { errores, productos: [], categoriasFaltantes: [] };
  }

  // Verificación de códigos en paralelo
  const promesasVerificacionCodigo = filas.map((fila) =>
    obtenerPresentacionesGet({ codigo: fila["CODIGO"] })
      .then((resultado) => {
        return {
          codigo: fila["CODIGO"],
          existe: Array.isArray(resultado?.objeto) && resultado.objeto.length > 0,
        };
      })
      .catch((error) => {
        return { codigo: fila["CODIGO"], error: true };
      })
  );
  
  const resultadosCodigos = await Promise.all(promesasVerificacionCodigo);
  console.log("RESULTADOS", resultadosCodigos);
  
  for (const [index, fila] of filas.entries()) {
    const filaNumero = index + 2;
    const erroresFila: string[] = [];

    const categoria = categorias.find((c: any) => c.nombre === fila["CATEGORIA"]);
    if (!categoria) {
      if (!categoriasFaltantes.includes(fila["CATEGORIA"])) {
        categoriasFaltantes.push(fila["CATEGORIA"]);
      }
      erroresFila.push(
        `Fila ${filaNumero}: La categoría "${fila["CATEGORIA"]}" no existe.`
      );
    }

    const area = areas.find((a: any) => a.nombre === fila["AREA DE PRODUCCION"]);
    if (!area) {
      erroresFila.push(
        `Fila ${filaNumero}: Área "${fila["AREA DE PRODUCCION"]}" no existe.`
      );
    }

    let tipo: number | null = null;
    const tipoTexto = (fila["TIPO"] || "").toUpperCase();
    tipo = tipoTexto === "ALMACENABLE"
        ? TipoProducto.Almacenado : tipoTexto === "PREPARADO"
        ? TipoProducto.Preparado : null;
    if (!tipo) {
      erroresFila.push(
        `Fila ${filaNumero}: Tipo "${fila["TIPO"]}" no es válido.`
      );
    }

    const verificado = resultadosCodigos[index];
    if ("error" in verificado && verificado.error) {
      erroresFila.push(
        `Fila ${filaNumero}: Error al verificar el código "${verificado.codigo}"`
      );
    } else if ("existe" in verificado && verificado.existe) {
      erroresFila.push(
        `Fila ${filaNumero}: Código "${verificado.codigo}" ya existe.`
      );
    }

    if (erroresFila.length > 0) {
      errores.push(...erroresFila);
      continue;
    }

    productos.push({
      codigo: fila["CODIGO"],
      nombre: fila["NOMBRE"],
      categoria_id: categoria!.id,
      id_area_produccion: area!.id,
      tipo_producto: tipo!,
      notas: [],
      estado: EstadoProducto.Activo,
      fecha_creacion,
      hora_creacion,
    });
  }
  return { errores, productos, categoriasFaltantes };
}

async function prepararPresentacionesParaImportar(
  filas: any[],
  codigosValidos: string[]
): Promise<{ errores: string[]; presentaciones: PresentacionPreparada[] }> {
  const errores: string[] = [];
  const presentaciones: PresentacionPreparada[] = [];

  for (const [index, fila] of filas.entries()) {
    const filaNumero = index + 2;
    const erroresFila: string[] = [];

    const codProd = fila["CODIGO PRODUCTO"];
    if (!codigosValidos.includes(codProd)) {
      erroresFila.push(
        `Fila ${filaNumero}: El código de producto "${codProd}" no es válido.`
      );
    }

    const codPres = fila["CODIGO PRESENTACION"];
    if (!codPres || codPres.trim() === "") {
      erroresFila.push(
        `Fila ${filaNumero}: Código de presentación obligatorio.`
      );
    } else {
      try {
        const res = await obtenerPresentacionesGet({ codigo: codProd });
        const yaExiste = res?.objeto?.[0]?.productos_presentacion?.some(
          (p: any) => p.presentacion_cod === codPres
        );
        if (yaExiste) {
          erroresFila.push(
            `Fila ${filaNumero}: Presentación "${codPres}" ya existe para el producto "${codProd}".`
          );
        }
      } catch {
        erroresFila.push(
          `Fila ${filaNumero}: Error al verificar la presentaciones para el codigo "${codProd}".`
        );
      }
    }

    if (!fila["DESCRIPCION"])
      erroresFila.push(`Fila ${filaNumero}: Descripción obligatoria.`);
    if (isNaN(Number(fila["PRECIO"])))
      erroresFila.push(`Fila ${filaNumero}: Precio inválido.`);
    if (isNaN(Number(fila["COSTO"])))
      erroresFila.push(`Fila ${filaNumero}: Costo inválido.`);

    if (erroresFila.length > 0) {
      errores.push(...erroresFila);
      continue;
    }

    presentaciones.push({
      producto_codigo: codProd,
      presentacion_cod: codPres,
      descripcion: fila["DESCRIPCION"],
      precio: Number(fila["PRECIO"]),
      costo: Number(fila["COSTO"]),
      receta: Number(fila["RECETA"]) || 0,
      agregados: Number(fila["AGREGADOS"]) || 0,
      control_stock: Number(fila["CONTROL STOCK"]) || 0,
      stock: Number(fila["STOCK MIN"]) || 0,
      imagen: "",
      estado: EstadoProducto.Activo,
      fecha_creacion: fecha_creacion,
      hora_creacion: hora_creacion,
    });
  }
  console.log(presentaciones);

  return { errores, presentaciones };
}
