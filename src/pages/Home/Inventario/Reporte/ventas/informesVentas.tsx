import React from "react";
import { cubeOutline, documentTextOutline } from "ionicons/icons";
import CartaInforme from "../../../../../components/compartidos/CartaInforme";
import "../informes.css";
import values from "../../../../../models/clases/values";

const InformesVentas: React.FC = () => {
  const informes = [
    {
      id: 1,
      titulo: "Reporte de ganancia",
      descripcion:
        "Visualiza un margen de ganancia de tus productos",
      icono: cubeOutline,
      ruta: values.rutas.rutas.homePrincipal.rutaPrincipal+values.rutas.rutas.homePrincipal.informes.margen_de_ganacia,
    },
  ];

  return (
    <div className="contenedor-informes">
      <h1 className="titulo-informes">INFORMES DE VENTAS</h1>
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

export default InformesVentas;
