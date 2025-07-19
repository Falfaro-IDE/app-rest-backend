import { useState } from "react";
import { exportarExcel } from "../../../../../utils/exportarExcel";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import { cloudDownloadOutline } from "ionicons/icons";

interface ExportarProductosProps {
  items: any[];
  vistaActiva?: "productos" | "insumos"; // Hacerlo opcional
  columnasPersonalizadas?: {
    [columna: string]: (item: any) => any;
  };
  nombreArchivo?: string;
}

const ExportarProductos = ({
  items,
  vistaActiva,
  columnasPersonalizadas,
  nombreArchivo,
}: ExportarProductosProps) => {
  const [exportando, setExportando] = useState(false);

  const handleExportar = async () => {
    if (!items || items.length === 0) return;

    try {
      setExportando(true);

      // Exportar Productos
      if (vistaActiva === "productos") {
        const hojaProductos = items.map((producto) => ({
          CODIGO: producto.codigo,
          CATEGORIA: producto.categoria?.nombre || "",
          NOMBRE: producto.nombre,
          "AREA DE PRODUCCION": producto.area_produccion?.nombre || "",
          TIPO: producto.tipo_producto === 1 ? "ALMACENABLE" : "PREPARADO",
        }));

        const hojaPresentaciones = items.flatMap((producto) =>
          producto.productos_presentacion.map((p: any) => ({
            "CODIGO PRODUCTO": producto.codigo,
            "CODIGO PRESENTACION": p.presentacion_cod,
            DESCRIPCION: p.descripcion,
            PRECIO: p.precio,
            COSTO: p.costo,
            RECETA: p.receta ? "SI" : "NO",
            AGREGADOS: p.agregados ? "SI" : "NO",
            "CONTROL STOCK": p.control_stock ? "SI" : "NO",
            "STOCK MIN": p.stock,
          }))
        );

        await exportarExcel(
          {
            productos: hojaProductos,
            presentaciones: hojaPresentaciones,
          },
          "productos_y_presentaciones.xlsx"
        );
      }

      // Exportar Insumos
      else if (vistaActiva === "insumos") {
        const hojaInsumos = items.map((insumo) => ({
          CODIGO: insumo.codigo,
          NOMBRE: insumo.nombre,
          UNIDAD: insumo.unidad_medida,
          STOCK: insumo.stock_minimo,
          CATEGORIA: insumo.categoria?.nombre || "",
        }));

        await exportarExcel({ insumos: hojaInsumos }, "insumos.xlsx");
      }

      // Exportar genérico con columnasPersonalizadas
      else if (columnasPersonalizadas) {
        const hojaGenerica = items.map((item) => {
          const fila: any = {};
          for (const key in columnasPersonalizadas) {
            fila[key] = columnasPersonalizadas[key](item);
          }
          return fila;
        });

        await exportarExcel(
          { datos: hojaGenerica },
          nombreArchivo || "exportacion.xlsx"
        );
      }
    } catch (error) {
      console.error("Error al exportar:", error);
    } finally {
      setExportando(false);
    }
  };

  return (
    <IonButton color="warning" onClick={handleExportar} disabled={exportando}>
      {exportando ? (
        <IonSpinner name="dots" slot="start" />
      ) : (
        <IonIcon slot="start" icon={cloudDownloadOutline} />
      )}
      {exportando ? "Exportando..." : "Exportar"}
    </IonButton>
  );
};

export default ExportarProductos;
