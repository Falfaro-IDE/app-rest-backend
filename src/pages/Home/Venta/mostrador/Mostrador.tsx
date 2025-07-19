import React, { useEffect, useState } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonLabel, IonChip, IonButton, IonSpinner, useIonRouter,
} from "@ionic/react";
import values from "../../../../models/clases/values";
import { useVenta } from "../../../../hooks/useVenta";
import useToast from "../../../../hooks/alertMessage/useToast";

type Pedido = {
  numero: number;
  cliente: string;
  monto: number;
  estado: "Pendiente" | "Pagado" | "En preparación" | string;
};

const getColor = (estado: Pedido["estado"]) => {
  const colores: Record<Pedido["estado"], string> = {
    Pendiente: "warning",
    Pagado: "success",
    "En preparación": "primary",
  };
  return colores[estado] || "medium";
};

const Mostrador: React.FC = () => {
  const router = useIonRouter();
  const { obtenerPedidos } = useVenta();
  const { showToast, ToastComponent } = useToast();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const irAVentaRapida = () => {
    const ruta = `${values.rutas.rutas.homePrincipal.rutaPrincipal}${values.rutas.rutas.homePrincipal.pedido}/0/0`;
    router.push(ruta, "forward");
  };

  const irAPedido = (id: number) => {
    const ruta = `${values.rutas.rutas.homePrincipal.rutaPrincipal}${values.rutas.rutas.homePrincipal.pedido}/${id}/0`;
    router.push(ruta, "forward");
  };

  const listarPedidos = async () => {
    setLoading(true);
    try {
      const response = await obtenerPedidos({});
      if (response.success) {
        const lista = response.data.objeto;
        if (lista.length === 0) {
          setPedidos([]); // lista vacía
        } else {
          const pedidosTransformados: Pedido[] = response.data.objeto.map((p: any) => ({
            numero: p.id,
            cliente: p.nombre_cliente || "Público en general",
            monto: p.monto_total,
            estado: p.estado === 1 ? "Pendiente" : "Pagado",
          }));
          setPedidos(pedidosTransformados);
          showToast("Pedidos obtenidos correctamente", 3000, "success");
        }
      }
    } catch {
      showToast("Error al obtener los pedidos", 3000, "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarPedidos();
  }, []);

  return (
    <div style={{ padding: 5 }}>
      {ToastComponent}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
      }}>
        <h2 style={{ margin: 0 }}>Pedidos</h2>
        <IonButton color="tertiary" size="small" onClick={irAVentaRapida}>
          Venta Rápida
        </IonButton>
      </div>

      {loading ? (
  <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
    <IonSpinner name="crescent" />
  </div>
) : pedidos.length === 0 ? (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "40vh", // puedes ajustar esto para centrar verticalmente
      textAlign: "center",
    }}
  >
    <p style={{ margin: 0, fontSize: "1rem", color: "#666" }}>
      No hay pedidos para el mostrador
    </p>
  </div>
) : (
  <div
    style={{
      display: "grid",
      gap: 8,
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    }}
  >
    {pedidos.map(({ numero, cliente, monto, estado }) => (
      <IonCard
        key={numero}
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        <div>
          <IonCardHeader style={{ paddingBottom: 8 }}>
            <IonCardTitle
              style={{ fontSize: "1rem", cursor: "pointer", color: "#3880ff" }}
              onClick={() => irAPedido(numero)}
            >
              Pedido #{numero}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingTop: 0, fontSize: "0.9rem" }}>
            <IonLabel>
              <strong>Cliente:</strong> {cliente}
            </IonLabel>
            <br />
            <IonLabel>
              <strong>Monto:</strong> S/ {typeof monto === "number" ? monto.toFixed(2) : "0.00"}
            </IonLabel>
            <br />
            <IonChip color={getColor(estado)} style={{ marginTop: 6 }}>
              <IonLabel>{estado}</IonLabel>
            </IonChip>
          </IonCardContent>
        </div>
      </IonCard>
    ))}
  </div>
)}

    </div>
  );
};

export default Mostrador;
