import React from "react";
import { cubeOutline, documentTextOutline } from "ionicons/icons";
import CartaInforme from "../../../../../components/compartidos/CartaInforme";
import "../informes.css";
import values from "../../../../../models/clases/values";

const InformesInventario: React.FC = () => {
  const informes = [
    {
      id: 1,
      titulo: "Reporte stock movimiento de producto",
      descripcion:
        "Visualiza los movimientos de productos e insumos dentro del inventario, con detalles de entradas, salidas y ajustes.",
      icono: cubeOutline,
      ruta: values.rutas.rutas.homePrincipal.rutaPrincipal+values.rutas.rutas.homePrincipal.informes.stock_movimiento_producto,
    },
    {
      id: 2,
      titulo: "Reporte de Kardex",
      descripcion:
        "Consulta el historial completo de operaciones del inventario, con fechas, cantidades y saldos precisos.",
      icono: documentTextOutline,
      ruta: values.rutas.rutas.homePrincipal.rutaPrincipal+values.rutas.rutas.homePrincipal.informes.inventario_kardex,
    },
  ];

  return (
    <div className="contenedor-informes">
      <h1 className="titulo-informes">INFORMES DE INVENTARIO</h1>
      <div className="grid-informes">
        {informes.map((informe) => (
          <CartaInforme
            key={informe.id}
            titulo={informe.titulo}
            descripcion={informe.descripcion}
            ruta={informe.ruta}
            icono={informe.icono}
          />
        ))}
      </div>
    </div>
  );
};

export default InformesInventario;
