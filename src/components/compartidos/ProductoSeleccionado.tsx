import React, { useState, useEffect } from "react";
import {
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { addCircle, trash } from "ionicons/icons";
import { ResultadoItem } from "./BuscadorList";
import { convertirCantidad } from "../../utils/convertirUnidad";

interface UnidadMedida {
  id: number;
  con_descripcion: string;
  con_prefijo: number;
  con_correlativo: number;
}

interface ProductoSeleccionadoProps {
  producto: ResultadoItem | null;
  unidadesMedida: UnidadMedida[];
  onAgregar: (
    producto: ResultadoItem,
    unidadBase: UnidadMedida,
    cantidad: number,
    precio: number
  ) => void;
  onCancelar: () => void;
}

export const ProductoSeleccionado: React.FC<ProductoSeleccionadoProps> = ({
  producto,
  unidadesMedida,
  onAgregar,
  onCancelar,
}) => {
  const [unidadSeleccionada, setUnidadSeleccionada] =
    useState<UnidadMedida | null>(null);
  const [unidadBase, setUnidadBase] = useState<UnidadMedida | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [precio, setPrecio] = useState<number>(0);

  useEffect(() => {
    if (!producto) {
      setUnidadSeleccionada(null);
      setUnidadBase(null);
      setCantidad(1);
      setPrecio(0);
      return;
    }

    const unidadesValidas = unidadesMedida.filter(
      (u) => u.con_correlativo !== 0
    );

    if (producto.tipo === "presentacion") {
      const unidad = unidadesValidas.find((u) =>
        u.con_descripcion.toLowerCase().includes("unidad")
      );
      setUnidadSeleccionada(unidad || null);
      setUnidadBase(unidad || null);
    } else {
      const unidad = unidadesValidas.find(
        (u) => u.con_correlativo === producto.unida
      );
      setUnidadSeleccionada(unidad || null);
      setUnidadBase(unidad || null);
    }

    setCantidad(1);
    setPrecio(0);
  }, [producto, unidadesMedida]);

  if (!producto) return null;

  const puedeAgregar =
    unidadSeleccionada !== null &&
    unidadBase !== null &&
    cantidad > 0 &&
    precio >= 0;

  return (
    <div
      style={{
        marginTop: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          backgroundColor: "#f5f5f5",
          fontWeight: "bold",
          fontSize: "1rem",
          gap: 16,
        }}
      >
        <div style={{ flex: 2 }}>Producto</div>
        <div style={{ flex: 1 }}>Unidad</div>
        <div style={{ flex: 1 }}>Cantidad</div>
        <div style={{ flex: 1 }}>Precio</div>
        <div style={{ flex: 1 }}>Acciones</div>
      </div>

      {/* Inputs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          backgroundColor: "#fff",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Nombre */}
        <div style={{ flex: 2, fontWeight: 500 }}>{producto.nombre}</div>

        {/* Unidad */}
        <div style={{ flex: 1 }}>
          <IonSelect
            interface="popover"
            value={unidadSeleccionada?.con_correlativo}
            onIonChange={(e) => {
              const selectedId = e.detail.value;
              const unidad = unidadesMedida.find((u) => u.con_correlativo === selectedId) || null;
              setUnidadSeleccionada(unidad);
            }}
            disabled={producto.tipo === "presentacion"}
          >
            {(producto.tipo === "insumo" ? unidadesMedida : unidadesMedida.filter((u) =>
                u.con_descripcion.toLowerCase().includes("unidad")))
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

          {/* Mostrar Unidad Base */}
          <p style={{ fontSize: "0.75rem", marginTop: 1, color: "#666" }}>
            Unidad base: <strong>{unidadBase?.con_descripcion || "—"}</strong>
          </p>
        </div>

        {/* Cantidad */}
        <div style={{ flex: 1 }}>
          <IonInput
            type="number"
            value={cantidad}
            min={1}
            step="0.01"
            onIonChange={(e) => {
              const val = Number(e.detail.value);
              if (!isNaN(val) && val > 0) setCantidad(val);
            }}
            style={{ height: 40 }}
          />
        </div>

        {/* Precio */}
        <div style={{ flex: 1 }}>
          <IonInput
            type="number"
            value={precio}
            min={0}
            step="0.01"
            onIonChange={(e) => {
              const val = Number(e.detail.value);
              if (!isNaN(val) && val >= 0) setPrecio(val);
            }}
            style={{ height: 40 }}
          />
        </div>

        {/* Botones */}
        <div style={{ flex: 1, display: "flex", gap: 8 }}>
          <IonButton
            color="primary"
            disabled={!puedeAgregar}
            onClick={() => {
              if (unidadSeleccionada) {
                const unidadDestino =
                  producto.unida ?? unidadSeleccionada.con_correlativo;
                try {
                  const cantidadConvertida = convertirCantidad(
                    cantidad,
                    unidadSeleccionada.con_correlativo,
                    unidadDestino
                  );
                  onAgregar(
                    producto,
                    unidadBase ?? unidadSeleccionada,
                    cantidadConvertida,
                    precio
                  );
                } catch (error) {
                  alert("Por favor seleccione una unidad válida.");
                }
              } else {
                alert("Complete todos los campos correctamente");
              }
            }}
          >
            <IonIcon icon={addCircle} />
          </IonButton>

          <IonButton color="danger" onClick={onCancelar}>
            <IonIcon icon={trash} />
          </IonButton>
        </div>
      </div>
    </div>
  );
};
