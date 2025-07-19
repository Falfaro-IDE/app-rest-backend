import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonCheckbox,
} from "@ionic/react";
import TablaPersonalizada from "../../../../../components/compartidos/TablaPersonalizada";
import { useProducto } from "../../../../../hooks/useProducto";
import { Categoria } from "../../../../../models/clases/Producto";
import useToast from "../../../../../hooks/alertMessage/useToast";
import { useInsumo } from "../../../../../hooks/useInsumo";
import { TipoProducto } from "../../../../../models/clases/concepts";
import { useConceptos } from "../../../../../hooks/useConceptos";
import ExportarProductos from "../../../Ajustes/Producto/Import_Export/ExportarProductos";
import '../informes.css'

const Stock: React.FC = () => {
  const [tipoFiltro, setTipoFiltro] = useState<number>(1); // 1 = Producto, 2 = Insumo
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas");
  const [verBajoStock, setVerBajoStock] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState("");
  const { obtenerCategorias, obtenerPresentaciones } = useProducto();
  const { obtenerInsumos } = useInsumo();
  const [todasLasCategorias, setTodasLasCategorias] = useState<Categoria[]>([]);
  const { showToast, ToastComponent } = useToast();
  const [insumos, setInsumos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [conceptosUnidades, setConceptosUnidades] = useState<any[]>([]);
  const { obtenerConceptos } = useConceptos();

  const obtenerNombreUnidad = useCallback(
    (id: number) => {
      const concepto = conceptosUnidades.find((c) => c.con_correlativo == id);
      return concepto ? concepto.con_descripcion : "";
    },
    [conceptosUnidades]
  );

  const categoriasFiltradas = useMemo(() => {
    return todasLasCategorias.filter((cat) => cat.tipo === tipoFiltro);
  }, [todasLasCategorias, tipoFiltro]);

  const data = useMemo(() => {
    if (tipoFiltro === 2) {
      return insumos.map((ins) => ({
        tipo: 2,
        codigo: ins.codigo,
        nombre: ins.nombre,
        categoria: ins.categoria?.nombre || "Sin categoría",
        unidad_medida: obtenerNombreUnidad(ins.unidad_medida),
        stock_minimo: ins.stock_minimo ?? 0,
        stock_real: ins.stock_real ?? 0,
      }));
    }

    const presentaciones = productos.flatMap((prod) =>
      (prod.productos_presentacion || []).map((pres: any) => ({
        tipo: 1,
        codigo: pres.presentacion_cod,
        nombre: pres.descripcion,
        categoria: prod.categoria?.nombre || "Sin categoría",
        unidad_medida: obtenerNombreUnidad(prod.unidad_medida),
        stock_minimo: pres.stock ?? 0,
        stock_real: pres.stock_real ?? 0,
      }))
    );

    return presentaciones;
  }, [tipoFiltro, insumos, productos, obtenerNombreUnidad]);

  const filtrados = useMemo(() => {
    return data.filter((item) => {
      const coincideTipo = item.tipo === tipoFiltro;
      const coincideCategoria =
        categoriaFiltro === "Todas" || item.categoria === categoriaFiltro;
      const coincideStock =
        !verBajoStock || item.stock_real < item.stock_minimo;
      const coincideBusqueda =
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.codigo.toLowerCase().includes(busqueda.toLowerCase());
      return (
        coincideTipo && coincideCategoria && coincideStock && coincideBusqueda
      );
    });
  }, [data, tipoFiltro, categoriaFiltro, verBajoStock, busqueda]);

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

  useEffect(() => {
    const cargarDatos = async () => {
      setCategoriaFiltro("Todas");
      if (tipoFiltro === 2) {
        try {
          const response = await obtenerInsumos({});
          setInsumos(response.data.objeto);
        } catch (error) {
          console.error("Error al obtener insumos", error);
        }
      } else {
        try {
          const response = await obtenerPresentaciones({
            tipo: TipoProducto.Almacenado,
          });
          setProductos(response?.data?.objeto || []);
        } catch (error) {
          console.error("Error al obtener productos", error);
          showToast("Error al obtener productos");
          setProductos([]);
        }
      }
    };

    cargarDatos();
  }, [tipoFiltro]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await obtenerConceptos({ con_prefijo: 12 });
        setConceptosUnidades(resp?.data?.objeto || []);
      } catch {
        showToast("Error al cargar las unidades", 3000, "danger");
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: "Tipo",
      selector: (row: any) => (row.tipo === 1 ? "Producto" : "Insumo"),
      sortable: true,
    },
    { name: "Código", selector: (row: any) => row.codigo, sortable: true },
    { name: "Nombre", selector: (row: any) => row.nombre, sortable: true },
    {
      name: "Categoría",
      selector: (row: any) => row.categoria,
      sortable: true,
    },
    {
      name: "Unidad de Medida",
      selector: (row: any) => row.unidad_medida || "Unidad",
      sortable: true,
    },
    {
      name: "Stock Mínimo",
      selector: (row: any) => row.stock_minimo,
      sortable: true,
    },
    {
      name: "Stock Real",
      selector: (row: any) => row.stock_real,
      sortable: true,
    },
  ];

  return (
    <div className="scroll-horizontal-informes">
      <div>
          <h1 style={{textAlign: 'center', fontWeight: 'bold', margin: '20px 0px'}}>STOCK DE PRODUCTOS</h1>
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px"}}
      >
        {/* Filtro Tipo */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <IonLabel>Tipo</IonLabel>
          <IonItem lines="none">
            <IonSelect
              value={tipoFiltro}
              onIonChange={(e) => {
                const nuevoTipo = Number(e.detail.value);
                setTipoFiltro(nuevoTipo);
              }}
            >
              <IonSelectOption value={1}>Producto</IonSelectOption>
              <IonSelectOption value={2}>Insumo</IonSelectOption>
            </IonSelect>
          </IonItem>
        </div>

        {/* Filtro Categoría */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <IonLabel>Categoría</IonLabel>
          <IonItem lines="none">
            <IonSelect
              value={categoriaFiltro}
              onIonChange={(e) => setCategoriaFiltro(e.detail.value)}
            >
              <IonSelectOption value="Todas">Todas</IonSelectOption>
              {categoriasFiltradas.map((cat) => (
                <IonSelectOption key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </div>

        {/* Filtro Stock bajo */}
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "24px" }}
        >
          <IonCheckbox
            checked={verBajoStock}
            onIonChange={(e) => setVerBajoStock(e.detail.checked)}
          />
          <span style={{ marginLeft: "8px" }}>
            Ver solo por debajo del stock mínimo
          </span>
        </div>
      </div>

      <ExportarProductos
        items={filtrados}
        columnasPersonalizadas={Object.fromEntries(
          columns.map((col) => [col.name, col.selector])
        )}
        nombreArchivo="stock_actual.xlsx"
      />

      {/* Tabla */}
        <TablaPersonalizada
          columns={columns}
          data={filtrados}
          showFilter={true}
          filterPlaceholder="Buscar por nombre o código"
          filterFunction={(item: any, text: any) =>
            item.nombre.toLowerCase().includes(text.toLowerCase()) ||
            item.codigo.toLowerCase().includes(text.toLowerCase())
          }
          noDataComponent={
            <div style={{ padding: "1rem" }}>No existen resultados</div>
          }
        />
      {ToastComponent}
    </div>
  );
};

export default Stock;
