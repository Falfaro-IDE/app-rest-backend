import {IonModal,IonHeader,IonToolbar,IonTitle,IonContent,IonItem,IonLabel,IonButton,IonIcon,IonFooter,IonLoading,IonText} from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import * as XLSX from "xlsx";
import React, { useRef, useState } from "react";
import { EstadoProducto, TipoProducto } from "../models/clases/concepts";
import { useProducto } from "../hooks/useProducto";
import { useInsumo } from "../hooks/useInsumo";
import { useAreaProduccion } from "../hooks/useAreasProduccion";
import { AreaProduccion, Categoria } from "../models/clases/Producto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mensaje: string) => void;
  tipoImportacion: "productos" | "insumos";
}

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

const columnasEsperadasInsumos = [
  "CODIGO",
  "CATEGORIA",
  "NOMBRE",
  "UNIDAD DE MEDIDA",
  "COSTO",
  "STOCK MINIMO",
];

const unidadesMedida = [
  { id: 1, nombre: "Unidades" },
  { id: 2, nombre: "Gramos" },
  { id: 3, nombre: "Kilogramos" },
  { id: 4, nombre: "Mililitros" },
  { id: 5, nombre: "Litros" },
];

interface ProductoPreparado {
  codigo: string;
  nombre: string;
  categoria_id: number;
  id_area_produccion: number;
  tipo_producto: number;
  notas: string[];
  estado: number;
  fecha_creacion: string;
  hora_creacion: string;
}

interface PresentacionPreparada {
  producto_codigo?: string; 
  producto_id?: number;
  presentacion_cod: string;
  descripcion: string;
  precio: number;
  costo: number;
  receta: number;
  agregados: number;
  control_stock: number;
  stock: number;
  estado: number;
  fecha_creacion: string;
  hora_creacion: string;
  imagen: string;
}

const ImportarProductosModal: React.FC<Props> = ({isOpen,onClose,onSuccess,tipoImportacion,}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const {crearProducto,obtenerCategorias,obtenerPresentaciones,crearPresentacion,} = useProducto();
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const { obtenerInsumos, crearInsumo } = useInsumo();
  const { obtenerAreaProduccion } = useAreaProduccion();
  const [productos, setProductos] = useState<ProductoPreparado[]>([]);
  const [presentaciones, setPresentaciones] = useState<PresentacionPreparada[]>([]);
  const [categoriasFaltantes, setCategoriasFaltantes] = useState<string[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);

  //Descargar Formatos de excel
  const descargarFormato = () => {
    const archivo = tipoImportacion === "productos" ? "/archivos/Productos.xlsx" : "/archivos/Insumos.xlsx";
    const link = document.createElement("a");
    link.href = archivo;
    link.download = archivo.split("/").pop()!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //probar importacion productos y presentaciones
  const ProbarArchivoPresentaciones = async () => {
    if (!archivoSeleccionado) return;
    setCargando(true);
    setErrorToast("");
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const hojaProductos = workbook.Sheets["Productos"];
        const hojaPresentaciones = workbook.Sheets["Presentaciones"];

        if (!hojaProductos || !hojaPresentaciones) {
          setErrorToast(
            "El archivo debe contener las hojas 'Productos' y 'Presentaciones'"
          );
          setCargando(false);
          return;
        }

        const productosFilas = XLSX.utils.sheet_to_json(hojaProductos, {header: 0,}) as any[];
        const presentacionesFilas = XLSX.utils.sheet_to_json(hojaPresentaciones, { header: 0 }) as any[];

        const estructuraOk = await validarEstructuraExcelProductos(productosFilas, presentacionesFilas);
        if (estructuraOk) {
          const { errores, productos, categoriasFaltantes } = await prepararProductosParaImportar(productosFilas);
          const codigosProductosValidos = productos.map((p) => p.codigo);
          const { errores: erroresPresentaciones, presentaciones } =
            await prepararPresentacionesParaImportar(
              presentacionesFilas,
              codigosProductosValidos
            );
          const todosErrores = [...errores, ...erroresPresentaciones];
          if (todosErrores.length > 0) {
            setErrorToast("Errores encontrados:\n" + todosErrores.join("\n"));
            setCargando(false);
            return;
          }

          setProductos(productos);
          setPresentaciones(presentaciones);
          setCategoriasFaltantes(categoriasFaltantes);

          setErrorToast(
            "✅ Archivo procesado correctamente. Todo está listo para importar."
          );
        }
      } catch (error) {
        setErrorToast("Error al procesar el archivo");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    reader.readAsArrayBuffer(archivoSeleccionado);
  };

  //validar archivo de excel productos y presentaciones
  const validarEstructuraExcelProductos = async (
    productos: any[],
    presentaciones: any[]
  ): Promise<boolean> => {
    if (!Array.isArray(productos) || productos.length === 0) {
      setErrorToast("La hoja 'Productos' está vacía o mal formateada.");
      return false;
    }
    if (!Array.isArray(presentaciones) || presentaciones.length === 0) {
      setErrorToast("La hoja 'Presentaciones' está vacía o mal formateada.");
      return false;
    }
    const encabezadoProductos = Object.keys(productos[0]);
    const encabezadoPresentaciones = Object.keys(presentaciones[0]);
    const faltanProductos = columnasEsperadasProductos.filter(
      (col) => !encabezadoProductos.includes(col)
    );
    const faltanPresentaciones = columnasEsperadasPresentaciones.filter(
      (col) => !encabezadoPresentaciones.includes(col)
    );
    if (faltanProductos.length > 0 || faltanPresentaciones.length > 0) {
      const errores: string[] = [];
      if (faltanProductos.length) {
        errores.push(
          `Faltan columnas en 'Productos': ${faltanProductos.join(", ")}`
        );
      }
      if (faltanPresentaciones.length) {
        errores.push(
          `Faltan columnas en 'Presentaciones': ${faltanPresentaciones.join(
            ", "
          )}`
        );
      }
      setErrorToast(errores.join(" | "));
      return false;
    }
    return true;
  };

  //preparar productos para importar 
  async function prepararProductosParaImportar(filas: any[]):Promise<{errores: string[]; productos: ProductoPreparado[]; categoriasFaltantes: string[];}> {
    const errores: string[] = [];
    const productos: ProductoPreparado[] = [];
    const categoriasFaltantes: string[] = [];

    const categoriasResponse = await obtenerCategorias();
    const categorias: Categoria[] = categoriasResponse.data.objeto;

    const areasProduccionResponse = await obtenerAreaProduccion();
    const areas: AreaProduccion[] = areasProduccionResponse.data.objeto;

    const fechaActual = new Date();
    const fecha_creacion = fechaActual.toISOString().split("T")[0];
    const hora_creacion = fechaActual.toLocaleTimeString("es-PE", {
      hour12: false,
    });

    // Verificación de códigos en paralelo
    const promesasVerificacionCodigo = filas.map((fila) =>
      obtenerPresentaciones({ codigo: fila["CODIGO"] })
        .then((resultado) => ({
          codigo: fila["CODIGO"],
          existe: resultado?.data.objeto?.length > 0,
        }))
        .catch(() => ({ codigo: fila["CODIGO"], error: true }))
    );

    const resultadosCodigos = await Promise.all(promesasVerificacionCodigo);

    for (const [index, fila] of filas.entries()) {
      const filaNumero = index + 2;
      const erroresFila: string[] = [];

      // Categoría
      const nombreCategoria = fila["CATEGORIA"];
      let categoria = categorias.find((c) => c.nombre === nombreCategoria);

      if (!categoria) {
        if (!categoriasFaltantes.includes(nombreCategoria)) {
          categoriasFaltantes.push(nombreCategoria);
        }
        erroresFila.push(
          `Fila ${filaNumero}: La categoría "${nombreCategoria}" no existe.`
        );
      }

      // Área de producción
      const nombreArea = fila["AREA DE PRODUCCION"];
      const area = areas.find((a) => a.nombre === nombreArea);
      if (!area) {
        erroresFila.push(
          `Fila ${filaNumero}: Área de producción "${nombreArea}" no existe.`
        );
      }

      // Tipo
      const tipoTexto = (fila["TIPO"] || "").toUpperCase();
      let tipo_producto: number | null = null;
      if (tipoTexto === "ALMACENABLE") {
        tipo_producto = TipoProducto.Almacenado;
      } else if (tipoTexto === "PREPARADO") {
        tipo_producto = TipoProducto.Preparado;
      } else {
        erroresFila.push(
          `Fila ${filaNumero}: Tipo "${fila["TIPO"]}" no es válido.`
        );
      }

      // Código duplicado
      const resultadoCodigo = resultadosCodigos[index];
      if ("error" in resultadoCodigo && resultadoCodigo.error) {
        erroresFila.push(
          `Fila ${filaNumero}: Error al verificar el código "${resultadoCodigo.codigo}".`
        );
      } else if ("existe" in resultadoCodigo && resultadoCodigo.existe) {
        erroresFila.push(
          `Fila ${filaNumero}: Código "${resultadoCodigo.codigo}" ya existe.`
        );
      }

      if (erroresFila.length > 0) {
        errores.push(...erroresFila);
        continue;
      }
      // Agregar producto preparado
      productos.push({
        codigo: fila["CODIGO"],
        nombre: fila["NOMBRE"],
        categoria_id: categoria!.id,
        id_area_produccion: area!.id,
        tipo_producto: tipo_producto!,
        notas: [],
        estado: EstadoProducto.Activo,
        fecha_creacion,
        hora_creacion,
      });
    }
    return { errores, productos, categoriasFaltantes };
  }

  //preparar presentaciones para importar
  async function prepararPresentacionesParaImportar(filas: any[],codigosProductosValidos: string[]):Promise<{ errores: string[]; presentaciones: PresentacionPreparada[] }> {
    const errores: string[] = [];
    const presentaciones: PresentacionPreparada[] = [];

    for (const [index, fila] of filas.entries()) {
      const filaNumero = index + 2;
      const erroresFila: string[] = [];

      const codigoProducto = fila["CODIGO PRODUCTO"];
      const codigoPresentacion = fila["CODIGO PRESENTACION"];

      // Validar que el producto exista en los códigos válidos (solo código, no id)
      if (!codigosProductosValidos.includes(codigoProducto)) {
        erroresFila.push(
          `Fila ${filaNumero}: El código de producto "${codigoProducto}" no existe en la lista de productos importados.`
        );
        errores.push(...erroresFila);
        continue;
      }

      if (!codigoPresentacion || codigoPresentacion.trim() === "") {
        erroresFila.push(
          `Fila ${filaNumero}: El código de presentación es obligatorio.`
        );
      } else {
        try {
          const resultado = await obtenerPresentaciones({
            codigo: codigoProducto,
          });

          const existePresentacion =
            resultado?.data?.objeto?.[0]?.productos_presentacion?.some(
              (p: any) => p.presentacion_cod === codigoPresentacion
            );

          if (existePresentacion) {
            erroresFila.push(
              `Fila ${filaNumero}: El código de presentación "${codigoPresentacion}" ya existe para el producto "${codigoProducto}".`
            );
          }
        } catch (e) {
          erroresFila.push(
            `Fila ${filaNumero}: Error al verificar presentaciones para el producto "${codigoProducto}".`
          );
        }
      }

      if (!fila["DESCRIPCION"] || fila["DESCRIPCION"].trim() === "") {
        erroresFila.push(`Fila ${filaNumero}: La descripción es obligatoria.`);
      }

      if (isNaN(Number(fila["PRECIO"])) || Number(fila["PRECIO"]) < 0) {
        erroresFila.push(`Fila ${filaNumero}: Precio inválido.`);
      }

      if (isNaN(Number(fila["COSTO"])) || Number(fila["COSTO"]) < 0) {
        erroresFila.push(`Fila ${filaNumero}: Costo inválido.`);
      }

      if (erroresFila.length > 0) {
        errores.push(...erroresFila);
        continue;
      }

      // Preparar presentación SIN producto_id porque aún no existe
      presentaciones.push({
        producto_codigo: fila["CODIGO PRODUCTO"],
        presentacion_cod: codigoPresentacion,
        descripcion: fila["DESCRIPCION"],
        precio: Number(fila["PRECIO"]),
        costo: Number(fila["COSTO"]),
        receta: Number(fila["RECETA"]) || 0,
        agregados: Number(fila["AGREGADOS"]) || 0,
        control_stock: Number(fila["CONTROL STOCK"]) || 0,
        stock: Number(fila["STOCK MIN"]) || 0,
        imagen: "",
        estado: EstadoProducto.Activo,
        fecha_creacion: new Date().toISOString().split("T")[0],
        hora_creacion: new Date().toLocaleTimeString("es-PE", {
          hour12: false,
        }),
      });
    }

    return { errores, presentaciones };
  }

  //importar presentaciones y productos
  const ImpotarPresentaciones = async () => {
    if (cargando) return;
    if (!productos.length) {
      setErrorToast("No hay productos para importar.");
      return;
    }
    setCargando(true);
    setErrorToast("");

    try {
      const productosGuardados: Record<string, number> = {}; // { codigoProducto: id }

      // 1. Guardar productos y registrar ID devuelto por cada uno
      for (const producto of productos) {
        const response = await crearProducto(producto);
        if (!response.success) {
          throw new Error(`Error al guardar producto ${producto.codigo}`);
        }

        const productoId = response.data.objeto.id;
        productosGuardados[producto.codigo] = productoId;
      }

      // 2. Guardar presentaciones
      for (const presentacion of presentaciones) {
        if (presentacion.producto_codigo) {
          const idProducto = productosGuardados[presentacion.producto_codigo];
          if (!idProducto) {
            console.warn(`No se encontró el producto para la presentación ${presentacion.descripcion}`);
            continue;
          }
          // Asignamos producto_id a la presentación
          presentacion.producto_id = idProducto;
          const response = await crearPresentacion(presentacion);
          if (!response.success) {
            throw new Error(`Error al guardar presentación ${presentacion.descripcion}`);
          }
        } else {
          console.warn(`La presentación ${presentacion.descripcion} no tiene un código de producto asociado`);
        }
      }
      setErrorToast("✅ Importación completada con éxito.");
      onSuccess("Productos y presentaciones importados correctamente.");
      onClose();
    } catch (error: any) {
      setErrorToast(error.message || "Error durante la importación.");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };
  
  
  //probar importacion de insumos
  const ProbarArchivoInsumos = async () => {
    if (!archivoSeleccionado) return;
    setCargando(true);
    setErrorToast("");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const hojaInsumos = workbook.Sheets[workbook.SheetNames[0]]; // Usamos la primera hoja
        if (!hojaInsumos) {
          setErrorToast("El archivo no contiene hojas válidas.");
          setCargando(false);
          return;
        }

        const insumosFilas = XLSX.utils.sheet_to_json(hojaInsumos, {
          header: 0,
        }) as any[];

        const estructuraOk = await validarEstructuraExcelInsumos(insumosFilas);

        if (!estructuraOk) {
          setErrorToast("La estructura del archivo de insumos no es válida.");
          setCargando(false);
          return;
        }

        const { insumos, errores } = await prepararInsumosParaImportar(insumosFilas, unidadesMedida);

        if (errores.length > 0) {
          setErrorToast("Errores encontrados:\n" + errores.join("\n"));
          setCargando(false);
          return;
        }

        // Si todo bien, puedes guardar luego
        setInsumos(insumos); // si usas un estado para guardarlos temporalmente

        setErrorToast("✅ Archivo de insumos procesado correctamente. Todo está listo para importar.");
      } catch (error) {
        setErrorToast("Error al procesar el archivo de insumos.");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    reader.readAsArrayBuffer(archivoSeleccionado);
  };

  //validar archivo de excel de insumos
  const validarEstructuraExcelInsumos = async (
    insumos: any[]
  ): Promise<boolean> => {
    if (!Array.isArray(insumos) || insumos.length === 0) {
      setErrorToast("La hoja de insumos está vacía o mal formateada.");
      return false;
    }

    const encabezado = Object.keys(insumos[0]);
    const faltantes = columnasEsperadasInsumos.filter(
      (col) => !encabezado.includes(col)
    );

    if (faltantes.length > 0) {
      setErrorToast(
        `Faltan columnas en la hoja de insumos: ${faltantes.join(", ")}`
      );
      return false;
    }

    return true;
  };

  //preparar importacion de insumos
  const prepararInsumosParaImportar = async (
    filas: any[],
    unidadesMedida: any[]
  ): Promise<{
    insumos: any[];
    errores: string[];
  }> => {
    const errores: string[] = [];
    const insumos: any[] = [];

    // Recolectar todos los códigos del archivo
    const codigosVistos: Set<string> = new Set();

    for (let i = 0; i < filas.length; i++) {
      const fila = filas[i];

      try {
        // 1. Validar y obtener categoría
        const categoriaNombre = fila["CATEGORIA"];
        if (!categoriaNombre) throw new Error(`Categoría vacía`);

        const categoriaExistente = await getCategoriaByNombre(categoriaNombre);
        const categoriaId = categoriaExistente
          ? categoriaExistente.id
          : (await crearCategoria({ nombre: categoriaNombre })).id;

        // 2. Validar unidad de medida
        const unidadNombre = fila["UNIDAD DE MEDIDA"];
        const unidad = unidadesMedida.find(
          (u) => u.nombre.toLowerCase() === unidadNombre?.toLowerCase()
        );
        if (!unidad) throw new Error(`Unidad de medida inválida: "${unidadNombre}"`);

        // 3. Validar código
        const codigo = fila["CODIGO"];
        if (!codigo) throw new Error(`Código vacío`);

        // Verificar duplicado en el archivo
        if (codigosVistos.has(codigo)) {
          throw new Error(`Código duplicado en el archivo: "${codigo}"`);
        }
        codigosVistos.add(codigo);

        // Verificar si ya existe en BD
        const existente = await obtenerInsumos({ codigo: codigo });
        if (existente.data.objeto?.length > 0) throw new Error(`El código "${codigo}" ya existe en el sistema`);

        // 4. Validar otros campos
        const nombre = fila["NOMBRE"];
        const costo = parseFloat(fila["COSTO"]);
        const stockMinimo = parseFloat(fila["STOCK MINIMO"]);

        if (!nombre || isNaN(costo) || isNaN(stockMinimo)) {
          throw new Error(`Datos inválidos en la fila`);
        }

        // 5. Armar objeto insumo
        const insumo = {
          codigo,
          nombre,
          categoria_id: categoriaId,
          unidad_medida: unidad.id,
          costo_unitario: costo,
          stock_minimo: stockMinimo,
          estado: EstadoProducto.Activo,
          fecha_creacion: new Date().toISOString().split("T")[0],
          hora_creacion: new Date().toLocaleTimeString("es-PE", {
            hour12: false,
          }),
        };

        insumos.push(insumo);
      } catch (error) {
        errores.push(
          `Fila ${i + 2} (Código: ${fila["CODIGO"] || "sin código"}): ${
            (error as Error).message
          }`
        );
      }
    }

    return { insumos, errores };
  };

  //importar insumos
  const ImportarInsumos = async () => {
    if (cargando) return;
    if (!insumos.length) {
      setErrorToast("No hay insumos para importar.");
      return;
    }

    setCargando(true);
    setErrorToast("");

    try {
      for (const insumo of insumos) {
        const response = await crearInsumo(insumo);
        if (!response.success) {
          throw new Error(`Error al guardar insumo ${insumo.codigo}`);
        }
      }

      setErrorToast("✅ Importación de insumos completada con éxito.");
      onSuccess("Insumos importados correctamente.");
      onClose();
    } catch (error: any) {
      setErrorToast(error.message || "Error durante la importación de insumos.");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  //obtener categorias
  async function getCategoriaByNombre(nombre: string): Promise<any | null> {
    try {
      const response = await obtenerCategorias();
      if (response.data.codigo === 1 && Array.isArray(response.data.objeto)) {
        return (
          response.data.objeto.find(
            (cat: any) => cat.nombre.toLowerCase() === nombre.toLowerCase()
          ) || null
        );
      }
      return null;
    } catch (error) {
      console.error("Error en getCategoriaByNombre:", error);
      return null;
    }
  }

  //crear categorias (aun no funciona)
  async function crearCategoria(data: { nombre: string }): Promise<any> {
    return { id: Math.floor(Math.random() * 1000), ...data };
  }

  //controla la prueba de importacion de productos o insumos
  async function ProbarImportacion() {
    if(tipoImportacion === "productos"){
      ProbarArchivoPresentaciones();
    }else{
      ProbarArchivoInsumos();
    }
  }

  //importa productos o insumos
  async function Importar() {
    if(tipoImportacion === "productos"){
      ImpotarPresentaciones();
    }else{
      ImportarInsumos();
    }
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Importar productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton fill="clear" onClick={descargarFormato}>
          <IonIcon slot="start" icon={downloadOutline} />
          Descargar formato{" "}
          {tipoImportacion === "productos" ? "productos" : "insumos"}
        </IonButton>

        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setArchivoSeleccionado(e.target.files?.[0] || null)}
        />
        <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
          Seleccionar archivo
        </IonButton>

        {archivoSeleccionado && (
          <>
            <IonItem>
              <IonLabel>Archivo: {archivoSeleccionado.name}</IonLabel>
            </IonItem>
            {errorToast && (
              <IonText color="danger" className="ion-padding-start">
                {errorToast}
              </IonText>
            )}
          </>
        )}

        <IonLoading
          isOpen={cargando}
          message="Procesando productos..."
          spinner="crescent"
        />
      </IonContent>
      <IonFooter className="ion-padding">
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => ProbarImportacion()} // solo validar
          disabled={cargando || !archivoSeleccionado}
          style={{ marginBottom: "8px" }}
        >
          {cargando ? "Procesando..." : "Probar"}
        </IonButton>

        <IonButton
          expand="block"
          color="primary"
          // onClick={() => ImportarArchivo()} // importar
          onClick={() => Importar()} // importar
          disabled={cargando || !archivoSeleccionado}
        >
          {cargando ? "Procesando..." : "Importar"}
        </IonButton>

        <IonButton
          expand="block"
          color="medium"
          onClick={onClose}
          disabled={cargando}
        >
          Cancelar
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default ImportarProductosModal;
