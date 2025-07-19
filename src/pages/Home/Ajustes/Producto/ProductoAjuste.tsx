import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonCard,
  IonButtons,
  IonText,
} from "@ionic/react";
import { add, cloudUploadOutline, create, pencil } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import "./ProductoAjuste.css";
import CategoriaCard from "../../../../components/compartidos/CategoriaCard";
import { useProducto } from "../../../../hooks/useProducto";
import ReusableModal from "../../../../components/compartidos/ReusableModal";
import {
  Categoria,
  ProductoPresentacion,
  ProductoSoloClass,
} from "../../../../models/clases/Producto";
import useToast from "../../../../hooks/alertMessage/useToast";
import { InsumoClass, Tipo } from "../../../../models/clases/insumo";
import { useInsumo } from "../../../../hooks/useInsumo";
import CondicionalBotonAccion from "../../../../components/compartidos/botonReceta";
import { ModalReceta } from "../../../../components/compartidos/ModalReceta";
import ImportarProductosModal from "./Import_Export/ImportarProductosModal ";
import ExportarProductos from "./Import_Export/ExportarProductos";
import { useConceptos } from "../../../../hooks/useConceptos";
import { useAreaProduccion } from "../../../../hooks/useAreasProduccion";

const ProductosAjustes: React.FC = () => {
  const [categorias, setCategorias] = useState<
    { nombre: string; id: number }[]
  >([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<{
    nombre: string;
    id?: number;
  }>({ nombre: "Totas", id: 0 });
  const [productoSeleccionado, setProductoSeleccionado] = useState<
    number | null
  >(null);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<number | null>(
    null
  );
  const [busqueda, setBusqueda] = useState<string>("");
  const [productos, setProductos] = useState<ProductoSoloClass[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAbiertoInsumos, setModalAbiertoInsumos] = useState(false);
  const {
    obtenerPresentaciones,
    obtenerCategorias,
    LoadingComponent,
    crearProducto,
    crearPresentacion,
    actualizarProducto,
    actualizarPresentacion,
  } = useProducto();
  const { obtenerInsumos, crearInsumo, actualizarInsumo } = useInsumo();
  const [presentacionEditar, setPresentacionEditar] = useState<any>(null);
  const [modalPresentacionAbierto, setModalPresentacionAbierto] =
    useState(false);
  const { showToast, ToastComponent } = useToast();
  const [productoEditar, setProductoEditar] =
    useState<ProductoSoloClass | null>(null);
  const [modoEdicion, setModoEdicion] = useState<"editar" | "agregar">(
    "editar"
  );
  const [productoIdSeleccionado, setProductoIdSeleccionado] = useState<
    number | null
  >(null);
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const horaActual = new Date().toTimeString().split(" ")[0];
  const fechaActual = new Date().toISOString().split("T")[0];
  const [vistaActiva, setVistaActiva] = useState<"productos" | "insumos">(
    "productos"
  );
  const [insumos, setInsumos] = useState<InsumoClass[]>([]);
  const [unidadesMedida, setUnidades] = useState<any[]>([]);
  const [areasProduccion, setAreasProduccion] = useState<any[]>([]);
  const listaActiva = vistaActiva === "productos" ? productos : insumos || [];
  const productosPorPagina = 10;
  const [paginaActual, setPaginaActual] = useState(1);
  let totalPaginas = Math.ceil(listaActiva.length / productosPorPagina);
  const [todasLasCategorias, setTodasLasCategorias] = useState<Categoria[]>([]);
  const items = vistaActiva === "productos" ? productos : insumos ?? [];
  const itemsPaginados = items.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );
  const [insumoEditar, setInsumoEditar] = useState<InsumoClass>(
    new InsumoClass()
  );
  const [tipoProductoSeleccionado, setTipoProductoSeleccionado] = useState<
    number | null
  >(null);
  const { obtenerConceptos } = useConceptos();
  const { obtenerAreaProduccion } = useAreaProduccion();
  const [modalRecetaAbierto, setModalRecetaAbierto] = useState(false);
  const [tipoModal, setTipoModal] = useState<"receta" | "agregados">("receta");
  const [modalImportarAbierto, setModalImportarAbierto] = useState(false);
  const erroresIniciales = {
    nombre: "",
    codigo: "",
    tipo_producto: "",
    categoria: "",
    area_produccion: "",
  };
  const [errores, setErrores] = useState(erroresIniciales);
  const limpiarErrores = () => setErrores(erroresIniciales);
  const erroresPresentacionIniciales = {
    descripcion: "",
    presentacion_cod: "",
    precio: "",
    stock: "",
    costo: "",
  };
  const [erroresPresentacion, setErroresPresentacion] = useState(
    erroresPresentacionIniciales
  );
  const limpiarErroresPres = () =>
    setErroresPresentacion(erroresPresentacionIniciales);
  const erroresInsumoIniciales = {
    nombre: "",
    codigo: "",
    unidad_medida: "",
    categoria: "",
    costo_unitario: "",
    stock_minimo: "",
  };
  const [erroresInsumo, setErroresInsumo] = useState(erroresInsumoIniciales);
  const limpiarErroresInsumos = () => setErroresInsumo(erroresInsumoIniciales);
  //obtener presentaciones para actualizar
  const fetchPresentaciones = useCallback(async () => {
    try {
      let categoriaParam = undefined;
      if (categoriaSeleccionada?.id && categoriaSeleccionada.id !== 0) {
        categoriaParam = { categoria_id: categoriaSeleccionada.id };
      }
      console.log(categoriaParam);

      const res = await obtenerPresentaciones({
        ...categoriaParam,
      });
      console.log(res);

      const areasProduccionResponse = await obtenerAreaProduccion();
      if (res?.data?.objeto) {
        setProductos(res.data.objeto);
        setAreasProduccion(areasProduccionResponse.data.objeto);
      } else {
        setProductos([]);
      }
    } catch (error) {
      showToast("Error al obtener productos");
      setProductos([]);
    }
  }, [categoriaSeleccionada]);

  // obtener insumos
  const fetchInsumos = useCallback(async () => {
    try {
      let categoriaParam = undefined;
      if (categoriaSeleccionada?.id && categoriaSeleccionada.id !== 0) {
        categoriaParam = { categoria_id: categoriaSeleccionada.id };
      }
      const response = await obtenerInsumos({ ...categoriaParam });
      const unidades = await obtenerConceptos({ con_prefijo: 12 });
      setInsumos(response.data.objeto);
      setUnidades(unidades.data.objeto);
    } catch (error) {
      console.error("Error al obtener insumos", error);
    }
  }, [categoriaSeleccionada]);

  // mostrar productos o insumos por la vista activa
  useEffect(() => {
    if (vistaActiva === "productos") {
      fetchPresentaciones();
    } else if (vistaActiva === "insumos") {
      fetchInsumos();
    }
  }, [vistaActiva, fetchPresentaciones, fetchInsumos]);

  // obtener categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        const categoriasDesdeApi = data.data.objeto;
        setTodasLasCategorias(categoriasDesdeApi);
      } catch (err) {
        showToast("Error al obtener categorías");
      }
    };
    fetchCategorias();
  }, []);

  // filtrar categorias por tipo de producto o insumo
  useEffect(() => {
    const tipo = vistaActiva === "productos" ? Tipo.Producto : Tipo.Insumo;
    const categoriasFiltradas = todasLasCategorias.filter(
      (cat) => cat.tipo === tipo
    );
    const categoriasConTodas = [
      { nombre: "Todas", id: 0 },
      ...categoriasFiltradas,
    ];

    setCategorias(categoriasConTodas);

    setCategoriaSeleccionada((prev) => {
      // Solo cambia si no es el objeto esperado
      if (!prev || prev.id !== 0) {
        return { nombre: "Todas las categorías", id: 0 };
      }
      return prev;
    });
  }, [vistaActiva, todasLasCategorias]);

  // actualizar pagina actual al cambiar la vista activa o categoria seleccionada
  useEffect(() => {
    setPaginaActual(1);
  }, [vistaActiva, categoriaSeleccionada, busqueda]);

  const renderProductos = () => {
    const productosFiltrados = items.filter((prod: any) =>
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const itemsPaginados = productosFiltrados.slice(
      (paginaActual - 1) * productosPorPagina,
      paginaActual * productosPorPagina
    );
    const renderProductoItem = (prod: any) => {
      const seleccionado = productoSeleccionado === prod.id;

      return (
        <IonCard key={prod.id} className="producto-card">
          <IonItem color={seleccionado ? "primary" : ""}>
            <IonLabel
              onClick={() =>
                setProductoSeleccionado(seleccionado ? null : prod.id)
              }
              style={{ cursor: "pointer"}}
            >
              {prod.nombre}
            </IonLabel>

            <IonButtons slot="end">
              <IonButton
                fill="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setModoEdicion("agregar");
                  setProductoIdSeleccionado(prod.id);
                  setTipoProductoSeleccionado(prod.tipo_producto);
                  setPresentacionEditar(new ProductoPresentacion());
                  setModalPresentacionAbierto(true);
                }}
              >
                <IonIcon icon={add} />
              </IonButton>

              <IonButton
                fill="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setProductoEditar(prod);
                  setModoEdicion("editar");
                  setModalAbierto(true);
                }}
              >
                <IonIcon icon={pencil} />
              </IonButton>
            </IonButtons>
          </IonItem>

          {seleccionado && prod.productos_presentacion.length > 0 && (
            <IonList>
              {prod.productos_presentacion.map((presentacion: any) => (
                <IonItem
                  key={presentacion.id}
                  lines="inset"
                  className="subproductos"
                  button
                  onClick={() => {
                    setPresentacionEditar({
                      ...presentacion,
                      producto_id: prod.id,
                    });
                    setModoEdicion("editar");
                    setTipoProductoSeleccionado(prod.tipo_producto);
                    setModalPresentacionAbierto(true);
                  }}
                >
                  <IonLabel className="subproducto-item">
                    {presentacion.descripcion} — S/. {presentacion.precio}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonCard>
      );
    };
    if (productosFiltrados.length === 0) {
      return <IonText color="medium">No se encontraron productos.</IonText>;
    }

    return itemsPaginados.map(renderProductoItem);
  };

  // renderizar insumos
  const renderInsumos = () => {
    const insumosFiltrados = items.filter((insumo: any) =>
      insumo.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    totalPaginas = Math.ceil(insumosFiltrados.length / productosPorPagina);
    const itemsPaginados = insumosFiltrados.slice(
      (paginaActual - 1) * productosPorPagina,
      paginaActual * productosPorPagina
    );
    const renderInsumoItem = (insumo: any) => {
      const seleccionado = insumoSeleccionado === insumo.id;

      return (
        <IonCard key={insumo.id} className="producto-card">
          <IonItem>
            <IonLabel>{insumo.nombre}</IonLabel>

            <IonButtons slot="end">
              <IonButton
                fill="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setInsumoEditar(insumo);
                  setModalAbiertoInsumos(true);
                  setModoEdicion("editar");
                }}
              >
                <IonIcon icon={pencil} />
              </IonButton>
            </IonButtons>
          </IonItem>
        </IonCard>
      );
    };
    if (insumosFiltrados.length === 0) {
      return <IonText color="medium">No se encontraron insumos.</IonText>;
    }
    return itemsPaginados.map(renderInsumoItem);
  };

  function validarProducto(producto: any) {
    return {
      nombre: !producto.nombre?.trim() ? "El nombre es obligatorio" : "",
      codigo: !producto.codigo?.trim() ? "El código es obligatorio" : "",
      tipo_producto:
        !producto.tipo_producto || producto.tipo_producto === 0
          ? "Seleccione un tipo de producto"
          : "",
      categoria:
        !producto.categoria || producto.categoria.id === 0
          ? "Seleccione una categoría"
          : "",
      area_produccion:
        !producto.area_produccion || producto.area_produccion.id === 0
          ? "Seleccione un área de producción"
          : "",
    };
  }

  function validarPresentacion(presentacion: any) {
    return {
      descripcion: !presentacion.descripcion?.trim()
        ? "La descripción es obligatoria"
        : "",
      presentacion_cod: !presentacion.presentacion_cod?.trim()
        ? "El código es obligatorio"
        : "",
      precio:
        presentacion.precio === null || presentacion.precio < 0
          ? "Precio inválido"
          : "",
      stock:
        presentacion.stock === null || presentacion.stock < 0
          ? "Stock inválido"
          : "",
      costo:
        presentacion.costo === null || presentacion.costo < 0
          ? "Costo inválido"
          : "",
    };
  }

  function validarInsumo(insumo: any) {
    return {
      nombre: !insumo.nombre?.trim() ? "El nombre es obligatorio" : "",
      codigo: !insumo.codigo?.trim() ? "El código es obligatorio" : "",
      unidad_medida:
        !insumo.unidad_medida || insumo.unidad_medida === 0
          ? "Seleccione unidad"
          : "",
      categoria:
        !insumo.categoria || insumo.categoria.id === 0
          ? "Seleccione categoría"
          : "",
      costo_unitario:
        insumo.costo_unitario === null || insumo.costo_unitario < 0
          ? "Costo inválido"
          : "",
      stock_minimo:
        insumo.stock_minimo === null || insumo.stock_minimo < 0
          ? "Stock mínimo inválido"
          : "",
    };
  }

  // editar producto
  const handleEditarProducto = async () => {
    try {
      if (!productoEditar) {
        showToast("No hay producto para editar");
        return;
      }
      const erroresValidacion = validarProducto(productoEditar);
      const hayErrores = Object.values(erroresValidacion).some((e) => e !== "");
      if (hayErrores) {
        setErrores(erroresValidacion);
        return;
      }
      const horaActual = new Date().toTimeString().split(" ")[0];
      const fechaActual = new Date().toISOString().split("T")[0];

      const notasArray = productoEditar.notas
        ? productoEditar.notas
            .split(",")
            .map((n) => n.trim())
            .filter((n) => n.length > 0)
        : [];
      const productoParaEnviar = {
        id: productoEditar.id,
        categoria_id: productoEditar.categoria.id,
        id_area_produccion: productoEditar.area_produccion.id,
        nombre: productoEditar.nombre,
        notas: notasArray,
        fecha_creacion: fechaActual,
        hora_creacion: horaActual,
        tipo_producto: productoEditar.tipo_producto,
        estado: productoEditar.estado,
        codigo: productoEditar.codigo,
      };
      const response = await actualizarProducto(productoParaEnviar);
      if (response.success) {
        showToast("Producto actualizado correctamente", 3000, "success");
        setModalAbierto(false);
        setProductos((productosActuales) =>
          productosActuales.map((p) =>
            p.id === productoParaEnviar.id
              ? {
                  ...p,
                  ...productoParaEnviar,
                  categoria: productoEditar.categoria,
                  area_produccion: productoEditar.area_produccion,
                  notas: productoEditar.notas,
                }
              : p
          )
        );
      } else {
        showToast("Error al actualizar producto", 3000, "danger");
      }
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar producto");
    }
  };

  //editar presentacion
  const handleEditarPresentacion = async () => {
    if (!presentacionEditar) return;
    const erroresVal = validarPresentacion(presentacionEditar);
    const hayErrores = Object.values(erroresVal).some((e) => e !== "");
    if (hayErrores) {
      setErroresPresentacion(erroresVal);
      return;
    }
    try {
      const horaActual = new Date().toTimeString().split(" ")[0]; // "HH:mm:ss"
      const fechaActual = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
      const presentacionParaEnviar = {
        id: presentacionEditar.id,
        producto_id: presentacionEditar.producto_id,
        presentacion_cod: presentacionEditar.presentacion_cod,
        descripcion: presentacionEditar.descripcion,
        precio: presentacionEditar.precio,
        imagen: presentacionEditar.imagen || "",
        stock: presentacionEditar.stock,
        costo: presentacionEditar.costo,
        estado: presentacionEditar.estado,
        agregados: presentacionEditar.agregados,
        control_stock: presentacionEditar.control_stock,
        receta: presentacionEditar.receta,
        fecha_creacion: fechaActual,
        hora_creacion: horaActual,
        cortesia: presentacionEditar.cortesia,
      };

      const response = await actualizarPresentacion(presentacionParaEnviar);
      if (response.success) {
        showToast("Presentación actualizada correctamente", 3000, "success");
        setProductos((productosActuales) =>
          productosActuales.map((producto) => {
            const tienePresentacion = producto.productos_presentacion.some(
              (p) => p.id === presentacionEditar.id
            );
            if (!tienePresentacion) return producto;

            const nuevasPresentaciones = producto.productos_presentacion.map(
              (p) =>
                p.id === presentacionEditar.id
                  ? { ...p, ...presentacionEditar }
                  : p
            );
            return {
              ...producto,
              productos_presentacion: nuevasPresentaciones,
            };
          })
        );
      } else {
        showToast("Error al actualizar presentación", 3000, "danger");
      }
      setModalPresentacionAbierto(false);
    } catch (error) {
      showToast("Error al actualizar presentación", 3000, "danger");
      console.error(error);
    }
  };

  // agregar producto
  const handleCrearProducto = async () => {
    try {
      if (!productoEditar) {
        showToast("No hay producto para agregar");
        return;
      }
      const erroresValidacion = validarProducto(productoEditar);
      const hayErrores = Object.values(erroresValidacion).some((e) => e !== "");
      if (hayErrores) {
        setErrores(erroresValidacion);
        return;
      }

      const notasArray = productoEditar.notas
        ? productoEditar.notas
            .split(",")
            .map((n) => n.trim())
            .filter((n) => n.length > 0)
        : [];
      const nuevoProductoParaEnviar = {
        categoria_id: productoEditar.categoria.id,
        id_area_produccion: productoEditar.area_produccion.id,
        nombre: productoEditar.nombre,
        notas: notasArray,
        fecha_creacion: fechaActual,
        hora_creacion: horaActual,
        tipo_producto: productoEditar.tipo_producto,
        estado: productoEditar.estado,
        codigo: productoEditar.codigo,
      };
      const response = await crearProducto(nuevoProductoParaEnviar); // Asumo función para crear
      if (!response.success) {
        showToast("Error al agregar producto", 3000, "danger");
        return;
      }
      showToast("Producto agregado correctamente", 3000, "success");
      setModalAbierto(false);
      fetchPresentaciones();
    } catch (error) {
      console.error(error);
      showToast("Error al agregar producto");
    }
  };

  // agregar presentacion
  const handleCrearPresentacion = async () => {
    if (!productoIdSeleccionado) return;
    const erroresVal = validarPresentacion(presentacionEditar);
    const hayErrores = Object.values(erroresVal).some((e) => e !== "");

    if (hayErrores) {
      setErroresPresentacion(erroresVal);
      return;
    }
    const data = {
      ...presentacionEditar,
      producto_id: productoIdSeleccionado,
      fecha_creacion: fechaActual,
      hora_creacion: horaActual,
      imagen: presentacionEditar.imagen || "",
      cortesia: presentacionEditar.cortesia,
    };
    try {
      const response = await crearPresentacion(data);
      if (!response.success) {
        showToast("Error al crear presentación", 3000, "danger");
        return;
      }
      showToast("Presentación creada correctamente", 3000, "success");
      setModalPresentacionAbierto(false);
      fetchPresentaciones();
    } catch (err) {
      showToast("Error al crear presentación", 3000, "danger");
    }
  };

  // agregar insumo
  const handleCrearInsumo = async () => {
    try {
      if (!insumoEditar) {
        showToast("No hay producto para agregar", 3000, "danger");
        return;
      }
      const erroresVal = validarInsumo(insumoEditar);
      const hayErrores = Object.values(erroresVal).some((e) => e !== "");

      if (hayErrores) {
        setErroresInsumo(erroresVal);
        return;
      }

      const nuevoInsumo = {
        categoria_id: insumoEditar.categoria.id,
        nombre: insumoEditar.nombre,
        codigo: insumoEditar.codigo,
        unidad_medida: insumoEditar.unidad_medida,
        costo_unitario: insumoEditar.costo_unitario,
        stock_minimo: insumoEditar.stock_minimo,
        fecha_creacion: fechaActual,
        hora_creacion: horaActual,
        estado: insumoEditar.estado,
      };

      const response = await crearInsumo(nuevoInsumo); // Asumo función para crear
      if (!response.success) {
        showToast("Error al agregar Insumo", 3000, "danger");
        return;
      }
      showToast("Insumo agregado correctamente", 3000, "success");
      setModalAbiertoInsumos(false);
      fetchInsumos();
    } catch (error) {
      console.error(error);
      showToast("Error al agregar insumo");
    }
  };

  //editar insumo
  const handleEditarInsumo = async () => {
    if (!insumoEditar) return;
    const erroresVal = validarInsumo(insumoEditar);
    const hayErrores = Object.values(erroresVal).some((e) => e !== "");

    if (hayErrores) {
      setErroresInsumo(erroresVal);
      return;
    }
    try {
      const horaActual = new Date().toTimeString().split(" ")[0]; // "HH:mm:ss"
      const fechaActual = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      const insumoParaEnviar = {
        id: insumoEditar.id,
        nombre: insumoEditar.nombre,
        unidad_medida: insumoEditar.unidad_medida,
        stock_minimo: insumoEditar.stock_minimo,
        costo_unitario: insumoEditar.costo_unitario,
        categoria_id: insumoEditar.categoria.id,
        estado: insumoEditar.estado,
        fecha_creacion: fechaActual,
        hora_creacion: horaActual,
      };

      console.log("INSUMO ACTUALIZAR", insumoParaEnviar);

      const response = await actualizarInsumo(insumoParaEnviar); // Debes tener este método en tu servicio
      if (response.success) {
        showToast("Insumo actualizado correctamente", 3000, "success");
        setInsumos((insumosActuales) =>
          insumosActuales.map((insumo) =>
            insumo.id === insumoEditar.id
              ? { ...insumo, ...insumoEditar }
              : insumo
          )
        );
      } else {
        showToast("Error al actualizar insumo", 3000, "danger");
      }

      setModalAbiertoInsumos(false);
    } catch (error) {
      showToast("Error al actualizar insumo", 3000, "danger");
      console.error(error);
    }
  };

  return (
    <div className="container-iteams">
      {LoadingComponent}
      {ToastComponent}

      {/* categoria y productos */}
      <IonGrid className="vista-productos-grid">
        <IonRow>
          {/* Categorías */}
          <IonCol size="12" sizeMd="2" className="col-categorias">
            {/* Botones de vista */}
            <div className="vista-toggle">
              <IonButton
                size="default"
                fill={vistaActiva === "productos" ? "solid" : "outline"}
                onClick={() => setVistaActiva("productos")}
              >
                Productos
              </IonButton>
              <IonButton
                size="default"
                fill={vistaActiva === "insumos" ? "solid" : "outline"}
                onClick={() => setVistaActiva("insumos")}
              >
                Insumos
              </IonButton>
            </div>

            {/* Título y botón de editar */}
            <div className="categoria-header">
              <h5 className="categoria-titulo">Categorías</h5>
              <IonButton
                size="small"
                onClick={() => {
                  if (categoriaSeleccionada.id === 0) return;
                  setModalCategoriaAbierto(true);
                }}
              >
                <IonIcon icon={pencil} />
              </IonButton>
            </div>

            {/* Lista de categorías */}
            <div className="categoria-lista">
              {categorias.map((cat) => (
                <div key={cat.id} className="categoria-item">
                  <CategoriaCard
                    cat={cat}
                    isActive={categoriaSeleccionada.id === cat.id}
                    onClick={(categoria) => {
                      setCategoriaSeleccionada(categoria);
                      setProductoSeleccionado(null);
                    }}
                  />
                </div>
              ))}
            </div>
          </IonCol>

          {/* Productos/Insumos */}
          <IonCol size="12" sizeMd="10" className="col-items">
            <div className="busqueda-barra">
              <IonSearchbar
                placeholder="Buscar producto"
                value={busqueda}
                onIonInput={(e) => setBusqueda(e.detail.value!)}
              />
              <div className="botones-barra">
                <IonButton
                  onClick={() => {
                    setModoEdicion("agregar");
                    if (vistaActiva === "productos") {
                      setProductoEditar(new ProductoSoloClass());
                      setModalAbierto(true);
                    } else {
                      setInsumoEditar(new InsumoClass());
                      setModalAbiertoInsumos(true);
                    }
                  }}
                >
                  <IonIcon slot="start" icon={create} />
                  Nuevo
                </IonButton>
                <IonButton
                  color="success"
                  onClick={() => setModalImportarAbierto(true)}
                >
                  <IonIcon slot="start" icon={cloudUploadOutline} />
                  Importar
                </IonButton>
                <ExportarProductos
                  items={vistaActiva === "productos" ? productos : insumos}
                  vistaActiva={vistaActiva}
                />
              </div>
            </div>

            {/* Listado */}
            {vistaActiva === "productos" && (
              <div className="lista-scroll">
                {productos.length > 0 ? (
                  <IonList>{renderProductos()}</IonList>
                ) : (
                  <div className="mensaje-vacio">
                    No hay productos disponibles
                  </div>
                )}
              </div>
            )}

            {vistaActiva === "insumos" && (
              <div className="lista-scroll">
                {insumos.length > 0 ? (
                  <IonList>{renderInsumos()}</IonList>
                ) : (
                  <div className="mensaje-vacio">
                    No hay insumos disponibles
                  </div>
                )}
              </div>
            )}

            {/* Paginación */}
            {(vistaActiva === "productos" || vistaActiva === "insumos") &&
              totalPaginas > 1 && (
                <div className="paginacion">
                  <IonButton
                    onClick={() =>
                      setPaginaActual((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={paginaActual === 1}
                  >
                    ←
                  </IonButton>
                  <span>
                    {paginaActual} de {totalPaginas}
                  </span>
                  <IonButton
                    onClick={() =>
                      setPaginaActual((prev) =>
                        Math.min(prev + 1, totalPaginas)
                      )
                    }
                    disabled={paginaActual === totalPaginas}
                  >
                    →
                  </IonButton>
                </div>
              )}
          </IonCol>
        </IonRow>
      </IonGrid>

      <ImportarProductosModal
        isOpen={modalImportarAbierto}
        onClose={() => setModalImportarAbierto(false)}
        onSuccess={(mensaje) => {
          showToast(mensaje);
          if (vistaActiva === "productos") {
            fetchPresentaciones(); // 🔁 recarga lista de productos
          } else {
            fetchInsumos(); // 🔁 recarga lista de insumos
          }
        }}
        tipoImportacion={vistaActiva}
      />

      {/* modal para editar producto */}
      <ReusableModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          limpiarErrores();
        }}
        onConfirm={
          modoEdicion === "editar" ? handleEditarProducto : handleCrearProducto
        }
        title={
          modoEdicion === "editar"
            ? `Editar producto: ${productoEditar?.nombre || ""}`
            : "Agregar nuevo producto"
        }
        cancelText="Cancelar"
        confirmText={modoEdicion === "editar" ? "Editar" : "Crear"}
      >
        {/* Nombre */}
        <IonItem>
          <IonLabel position="stacked">Nombre del producto</IonLabel>
          <IonInput
            placeholder="Ingrese el nombre del producto"
            value={productoEditar?.nombre}
            onIonChange={(e) =>
              setProductoEditar({ ...productoEditar!, nombre: e.detail.value! })
            }
          />
        </IonItem>
        {errores.nombre && (
          <IonText color="danger" className="ion-padding-start">
            {errores.nombre}
          </IonText>
        )}

        <IonItem>
          <IonLabel position="stacked">Código</IonLabel>
          <IonInput
            value={productoEditar?.codigo || ""}
            placeholder="Ingrese el codigo del producto"
            onIonChange={(e) =>
              setProductoEditar({
                ...productoEditar!,
                codigo: e.detail.value!,
              })
            }
          />
        </IonItem>
        {errores.codigo && (
          <IonText color="danger" className="ion-padding-start">
            {errores.codigo}
          </IonText>
        )}

        {/* Notas */}
        <IonItem>
          <IonLabel position="stacked">Notas</IonLabel>
          <IonTextarea
            placeholder="Ingrese notas o descripción"
            value={productoEditar?.notas}
            onIonChange={(e) =>
              setProductoEditar({ ...productoEditar!, notas: e.detail.value! })
            }
          />
        </IonItem>

        {/* Tipo de producto */}
        <IonItem>
          <IonLabel position="stacked">Tipo de producto</IonLabel>
          <IonSelect
            value={productoEditar?.tipo_producto || 0}
            onIonChange={(e) =>
              setProductoEditar({
                ...productoEditar!,
                tipo_producto: e.detail.value,
              })
            }
            placeholder="Seleccione tipo de producto"
          >
            <IonSelectOption value={0} disabled>
              Seleccione tipo
            </IonSelectOption>
            <IonSelectOption value={1}>ALMACENABLE</IonSelectOption>
            <IonSelectOption value={2}>PREPARADO</IonSelectOption>
          </IonSelect>
        </IonItem>
        {errores.tipo_producto && (
          <IonText color="danger" className="ion-padding-start">
            {errores.tipo_producto}
          </IonText>
        )}

        {/* Categoría */}
        <IonItem>
          <IonLabel position="stacked">Categoría</IonLabel>
          <IonSelect
            value={productoEditar?.categoria.id || 0}
            onIonChange={(e) =>
              setProductoEditar({
                ...productoEditar!,
                categoria: {
                  ...productoEditar!.categoria,
                  id: e.detail.value,
                },
              })
            }
            placeholder="Seleccione categoría"
          >
            <IonSelectOption value={0} disabled>
              Seleccione categoría
            </IonSelectOption>

            {categorias
              .filter((cat) => cat.id !== 0) // Filtramos aquí
              .map((cat) => (
                <IonSelectOption key={cat.id} value={cat.id}>
                  {cat.nombre}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>
        {errores.categoria && (
          <IonText color="danger" className="ion-padding-start">
            {errores.categoria}
          </IonText>
        )}

        {/* Área de producción */}
        <IonItem>
          <IonLabel position="stacked">Área de Producción</IonLabel>
          <IonSelect
            value={productoEditar?.area_produccion.id || 0}
            onIonChange={(e) =>
              setProductoEditar({
                ...productoEditar!,
                area_produccion: {
                  ...productoEditar!.area_produccion,
                  id: e.detail.value,
                },
              })
            }
            placeholder="Seleccione área de producción"
          >
            <IonSelectOption value={0} disabled>
              Seleccione área
            </IonSelectOption>
            {areasProduccion.map((area) => (
              <IonSelectOption key={area.id} value={area.id}>
                {area.nombre}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        {errores.area_produccion && (
          <IonText color="danger" className="ion-padding-start">
            {errores.area_produccion}
          </IonText>
        )}

        {/* Estado (Activo) */}
        <IonItem lines="none">
          <IonLabel>Activo</IonLabel>
          <IonCheckbox
            checked={productoEditar?.estado === 0}
            onIonChange={(e) =>
              setProductoEditar({
                ...productoEditar!,
                estado: e.detail.checked ? 0 : 1,
              })
            }
          />
        </IonItem>
      </ReusableModal>

      {/* modal para editar presentación */}
      <ReusableModal
        isOpen={modalPresentacionAbierto}
        onClose={() => {
          setModalPresentacionAbierto(false);
          setPresentacionEditar(null);
          setProductoIdSeleccionado(null);
          setModoEdicion("agregar");
          limpiarErroresPres();
        }}
        cancelText="Cancelar"
        confirmText={modoEdicion === "editar" ? "Editar" : "Crear"}
        onConfirm={
          modoEdicion === "editar"
            ? handleEditarPresentacion
            : handleCrearPresentacion
        }
        title={
          modoEdicion === "editar"
            ? `Editar Presentación: ${presentacionEditar?.descripcion ?? ""}`
            : "Agregar nueva presentación"
        }
      >
        <IonGrid>
          <IonRow>
            {/* Columna Izquierda */}
            <IonCol size="10" sizeMd="4">
              {/* Recuadro de imagen */}
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  border: "2px dashed #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: "#888",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  Click para agregar imagen
                </span>
              </div>

              {/* Checkboxes según tipo de producto */}
              {/* {tipoProductoSeleccionado === 1 && ( */}
              <>
                {/* <IonItem>
                    <IonLabel>Agregados</IonLabel>
                    <IonCheckbox
                      slot="end"
                      checked={presentacionEditar?.agregados === 0}
                      onIonChange={(e) =>
                        setPresentacionEditar({
                          ...presentacionEditar,
                          agregados: e.detail.checked ? 0 : 1,
                        })
                      }
                    />
                  </IonItem> */}

                {tipoProductoSeleccionado === 1 && (
                  <IonItem>
                    <IonLabel>Control Stock</IonLabel>
                    <IonCheckbox
                      slot="end"
                      checked={presentacionEditar?.control_stock === 0}
                      onIonChange={(e) =>
                        setPresentacionEditar({
                          ...presentacionEditar,
                          control_stock: e.detail.checked ? 0 : 1,
                        })
                      }
                    />
                  </IonItem>
                )}
              </>
              {/* )} */}

              {tipoProductoSeleccionado === 2 && (
                <IonItem>
                  <IonLabel>Tiene receta</IonLabel>
                  <IonCheckbox
                    slot="end"
                    checked={presentacionEditar?.receta === 0}
                    onIonChange={(e) =>
                      setPresentacionEditar({
                        ...presentacionEditar,
                        receta: e.detail.checked ? 0 : 1,
                      })
                    }
                  />
                </IonItem>
              )}

              {/* Siempre visible */}
              <IonItem>
                <IonLabel>Activo</IonLabel>
                <IonCheckbox
                  slot="end"
                  checked={presentacionEditar?.estado === 0}
                  onIonChange={(e) =>
                    setPresentacionEditar({
                      ...presentacionEditar,
                      estado: e.detail.checked ? 0 : 1,
                    })
                  }
                />
              </IonItem>

              <IonItem>
                <IonLabel>Es cortesia</IonLabel>
                <IonCheckbox
                  slot="end"
                  checked={presentacionEditar?.cortesia === 0}
                  onIonChange={(e) =>
                    setPresentacionEditar({
                      ...presentacionEditar,
                      cortesia: e.detail.checked ? 0 : 1,
                    })
                  }
                />
              </IonItem>
            </IonCol>

            {/* Columna Derecha */}
            <IonCol size="12" sizeMd="8">
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonInput
                  value={presentacionEditar?.descripcion || ""}
                  onIonChange={(e) =>
                    setPresentacionEditar({
                      ...presentacionEditar,
                      descripcion: e.detail.value!,
                    })
                  }
                />
              </IonItem>
              {erroresPresentacion.descripcion && (
                <IonText color="danger" className="ion-padding-start">
                  {erroresPresentacion.descripcion}
                </IonText>
              )}

              <IonItem>
                <IonLabel position="stacked">Código</IonLabel>
                <IonInput
                  value={presentacionEditar?.presentacion_cod || ""}
                  onIonChange={(e) =>
                    setPresentacionEditar({
                      ...presentacionEditar,
                      presentacion_cod: e.detail.value!,
                    })
                  }
                />
              </IonItem>
              {erroresPresentacion.presentacion_cod && (
                <IonText color="danger" className="ion-padding-start">
                  {erroresPresentacion.presentacion_cod}
                </IonText>
              )}
              <IonItem>
                <IonLabel position="stacked">Precio de venta</IonLabel>
                <IonInput
                  type="number"
                  min={0}
                  value={presentacionEditar?.precio || 0}
                  onIonChange={(e) =>
                    setPresentacionEditar({
                      ...presentacionEditar,
                      precio: Number(e.detail.value),
                    })
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "-" ||
                      e.key === "e" ||
                      e.key === "+" ||
                      e.key === ","
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </IonItem>
              {erroresPresentacion.precio && (
                <IonText color="danger" className="ion-padding-start">
                  {erroresPresentacion.precio}
                </IonText>
              )}
              <IonItem>
                <IonLabel position="stacked">Stock minimo</IonLabel>
                <IonInput
                  type="number"
                  min={0}
                  value={presentacionEditar?.stock || 0}
                  onIonChange={(e) =>
                    setPresentacionEditar({
                      ...presentacionEditar,
                      stock: Number(e.detail.value),
                    })
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "-" ||
                      e.key === "e" ||
                      e.key === "+" ||
                      e.key === ","
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </IonItem>
              {erroresPresentacion.stock && (
                <IonText color="danger" className="ion-padding-start">
                  {erroresPresentacion.stock}
                </IonText>
              )}
              <IonItem>
                <IonLabel position="stacked">Costo</IonLabel>
                <IonInput
                  type="number"
                  min={0}
                  value={presentacionEditar?.costo || 0}
                  onIonChange={(e) =>
                    setPresentacionEditar({
                      ...presentacionEditar,
                      costo: Number(e.detail.value),
                    })
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "-" ||
                      e.key === "e" ||
                      e.key === "+" ||
                      e.key === ","
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </IonItem>
              {erroresPresentacion.costo && (
                <IonText color="danger" className="ion-padding-start">
                  {erroresPresentacion.costo}
                </IonText>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* <CondicionalBotonAccion
          mostrar={presentacionEditar?.agregados === 0 && presentacionEditar?.id !== undefined && presentacionEditar?.id !== null}
          texto="➕ Agregar productos agregados aquí"
          color="primary"
          onClick={() => {
            setTipoModal('agregados');
            setModalRecetaAbierto(true);
          }}
        /> */}

        <CondicionalBotonAccion
          mostrar={
            presentacionEditar?.receta === 0 &&
            presentacionEditar?.id !== undefined &&
            presentacionEditar?.id !== null
          }
          texto="🍳 Ingresar receta aquí"
          color="tertiary"
          onClick={() => {
            setTipoModal("receta");
            setModalRecetaAbierto(true);
          }}
        />
      </ReusableModal>

      {modalRecetaAbierto && (
        <ModalReceta
          isOpen={modalRecetaAbierto}
          onClose={() => setModalRecetaAbierto(false)}
          presentacionId={presentacionEditar?.id!}
          tipo={tipoModal}
        />
      )}

      {/* modal para editar categoria */}
      <ReusableModal
        isOpen={modalCategoriaAbierto}
        onClose={() => setModalCategoriaAbierto(false)}
        onConfirm={(datosActualizados) => {
          // Actualizar la categoría en el estado
          setCategorias((prev) =>
            prev.map((cat) =>
              cat.id === datosActualizados.id ? datosActualizados : cat
            )
          );
          setModalCategoriaAbierto(false);
        }}
        title={`Editar Categoría: ${categoriaSeleccionada?.nombre || ""}`}
      >
        <IonItem>
          <IonLabel position="stacked">Nombre de la Categoría</IonLabel>
          <IonInput
            value={categoriaSeleccionada?.nombre || ""}
            onIonChange={(e) =>
              setCategoriaSeleccionada({
                ...categoriaSeleccionada,
                nombre: e.detail.value!,
              })
            }
          />
        </IonItem>
      </ReusableModal>

      {/* modal para editar insumos */}
      <ReusableModal
        isOpen={modalAbiertoInsumos}
        onClose={() => {
          setModalAbiertoInsumos(false), limpiarErroresInsumos();
        }}
        onConfirm={
          modoEdicion === "editar" ? handleEditarInsumo : handleCrearInsumo
        }
        title={
          modoEdicion === "editar"
            ? `Editar insumo: ${insumoEditar?.nombre || ""}`
            : "Agregar nuevo insumo"
        }
        cancelText="Cancelar"
        confirmText={modoEdicion === "editar" ? "Editar" : "Crear"}
      >
        {/* Nombre */}
        <IonItem>
          <IonLabel position="stacked">Nombre del insumo</IonLabel>
          <IonInput
            placeholder="Ingrese nombre"
            value={insumoEditar?.nombre}
            onIonChange={(e) =>
              setInsumoEditar({ ...insumoEditar!, nombre: e.detail.value! })
            }
          />
        </IonItem>
        {erroresInsumo.nombre && (
          <IonText color="danger" className="ion-padding-start">
            {erroresInsumo.nombre}
          </IonText>
        )}

        {/* Código */}
        <IonItem>
          <IonLabel position="stacked">Código</IonLabel>
          <IonInput
            placeholder="Ej. T_01"
            value={insumoEditar?.codigo}
            onIonChange={(e) =>
              setInsumoEditar({ ...insumoEditar!, codigo: e.detail.value! })
            }
          />
        </IonItem>
        {erroresInsumo.codigo && (
          <IonText color="danger" className="ion-padding-start">
            {erroresInsumo.codigo}
          </IonText>
        )}

        {/* Unidad de medida */}
        <IonItem>
          <IonLabel position="stacked">Unidad de medida</IonLabel>
          <IonSelect
            value={insumoEditar?.unidad_medida || 0}
            onIonChange={(e) =>
              setInsumoEditar({
                ...insumoEditar!,
                unidad_medida: e.detail.value,
              })
            }
            placeholder="Seleccione unidad"
          >
            <IonSelectOption value={0} disabled>
              Seleccione unidad
            </IonSelectOption>
            {unidadesMedida
              .filter((unidad) => unidad.con_correlativo !== 0)
              .map((unidad) => (
                <IonSelectOption
                  key={unidad.con_correlativo}
                  value={unidad.con_correlativo}
                >
                  {unidad.con_descripcion}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>
        {erroresInsumo.unidad_medida && (
          <IonText color="danger" className="ion-padding-start">
            {erroresInsumo.unidad_medida}
          </IonText>
        )}

        {/* Categoría */}
        <IonItem>
          <IonLabel position="stacked">Categoría</IonLabel>
          <IonSelect
            value={insumoEditar?.categoria?.id || 0}
            onIonChange={(e) => {
              const categoriaSeleccionada = categorias.find(
                (cat) => cat.id === e.detail.value
              );
              if (categoriaSeleccionada) {
                setInsumoEditar({
                  ...insumoEditar!,
                  categoria: new Categoria(categoriaSeleccionada), // 👈 Esto asegura que tenga tipo
                });
              }
            }}
            placeholder="Seleccione categoría"
          >
            <IonSelectOption value={0} disabled>
              Seleccione categoría
            </IonSelectOption>
            {categorias
              .filter((cat) => cat.id !== 0)
              .map((cat) => (
                <IonSelectOption key={cat.id} value={cat.id}>
                  {cat.nombre}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>
        {erroresInsumo.categoria && (
          <IonText color="danger" className="ion-padding-start">
            {erroresInsumo.categoria}
          </IonText>
        )}

        {/* Costo unitario */}
        <IonItem>
          <IonLabel position="stacked">Costo unitario</IonLabel>
          <IonInput
            type="number"
            placeholder="0.00"
            value={insumoEditar?.costo_unitario}
            onIonChange={(e) =>
              setInsumoEditar({
                ...insumoEditar!,
                costo_unitario: parseFloat(e.detail.value!),
              })
            }
          />
        </IonItem>
        {erroresInsumo.costo_unitario && (
          <IonText color="danger" className="ion-padding-start">
            {erroresInsumo.costo_unitario}
          </IonText>
        )}

        {/* Stock mínimo */}
        <IonItem>
          <IonLabel position="stacked">Stock mínimo</IonLabel>
          <IonInput
            type="number"
            placeholder="0"
            value={insumoEditar?.stock_minimo}
            onIonChange={(e) =>
              setInsumoEditar({
                ...insumoEditar!,
                stock_minimo: parseInt(e.detail.value!),
              })
            }
          />
        </IonItem>
        {erroresInsumo.stock_minimo && (
          <IonText color="danger" className="ion-padding-start">
            {erroresInsumo.stock_minimo}
          </IonText>
        )}

        {/* Estado */}
        <IonItem>
          <IonLabel>Activo</IonLabel>
          <IonCheckbox
            checked={insumoEditar?.estado === 0}
            onIonChange={(e) =>
              setInsumoEditar({
                ...insumoEditar,
                estado: e.detail.checked ? 0 : 1,
              })
            }
          />
        </IonItem>
      </ReusableModal>
    </div>
  );
};

export default ProductosAjustes;
