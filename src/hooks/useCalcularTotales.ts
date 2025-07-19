import { useCallback } from "react";

export const useResumenGanancia = () => {
  const calcularResumenGanancia = useCallback((lista: any[]) => {
    const resumen = lista.reduce(
      (acc, item) => {
        acc.cantidadVendida += item.cantidad_total_vendida ?? 0;
        acc.margenTotal += item.margen_ganancia_total ?? 0;
        return acc;
      },
      { cantidadVendida: 0, costoTotal: 0, margenTotal: 0, gananciaTotal: 0 }
    ); 

    resumen.gananciaTotal = resumen.margenTotal;

    return {
      cantidadVendida: parseFloat(resumen.cantidadVendida.toFixed(2)),
      costoTotal: parseFloat(resumen.costoTotal.toFixed(2)),
      margenTotal: parseFloat(resumen.margenTotal.toFixed(2)),
      gananciaTotal: parseFloat(resumen.gananciaTotal.toFixed(2)),
      cortesiaCombos: 0, // si deseas que sea dinámico, pásalo por props
    };
  }, []);

  return { calcularResumenGanancia };
};
