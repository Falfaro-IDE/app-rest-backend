import React from "react";
import {
  IonModal,
  IonSearchbar,
  IonSpinner,
} from "@ionic/react";
import CustomButton from "../compartidos/CustomButton";
import { ProductoSoloClass } from "../../models/clases/Producto";
import { InsumoClass } from "../../models/clases/Insumo";

interface Props {
  abierto: boolean;
  onClose: () => void;
  productos: (ProductoSoloClass | InsumoClass)[]; // <- Cambiado a ProductoSoloClass[] | InsumoClass[]
  categoriaSeleccionada?: string; // <- ahora es opcional
  busqueda: string;
  setBusqueda: (value: string) => void;
  onSeleccionar: (id: number) => void;
  loading?: boolean;
}

const ModalSeleccionProducto: React.FC<Props> = ({
  abierto,
  onClose,
  productos,
  categoriaSeleccionada,
  busqueda,
  setBusqueda,
  onSeleccionar,
  loading = false,
}) => {
  const productosFiltrados = productos.filter((item) => {
    const coincideBusqueda = item.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria = !categoriaSeleccionada || (
      item.categoria?.id === Number(categoriaSeleccionada)
    );

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <IonModal isOpen={abierto} onDidDismiss={onClose}>
      <div style={{ padding: "1rem" }}>
        <IonSearchbar
          value={busqueda}
          onIonInput={(e) => setBusqueda(e.detail.value!)}
          placeholder="Buscar..."
        />
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <IonSpinner name="dots" />
          </div>
        ) : (
          <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
            {productosFiltrados.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "0.65rem",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onSeleccionar(item.id);
                  onClose();
                  setBusqueda("");
                }}
              >
                {item.nombre}
              </div>
            ))}
          </div>
        )}
        <CustomButton
          text="Cerrar"
          color="danger"
          onClick={onClose}
          expand="block"
        />
      </div>
    </IonModal>
  );
};

export default ModalSeleccionProducto;
