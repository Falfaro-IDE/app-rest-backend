type PedidoDetalle = {
  precio: number;
  cantidad: number;
  descuento?: number; // porcentaje (por ejemplo: 0.1 para 10%)
  oferta?: number; // monto fijo
};

type ResultadoTotales = {
  subtotal: number;
  descuentoTotal: number;
  ofertaTotal: number;
  igv: number;
  totalFinal: number;
};

const DEFAULT_IGV_PORCENTAJE = 0; // 18% por defecto -> 0.18

export function calcularTotales(pedidos: PedidoDetalle[], igvPorcentaje = DEFAULT_IGV_PORCENTAJE): ResultadoTotales {
  let subtotal = 0;
  let descuentoTotal = 0;
  let ofertaTotal = 0;

  for (const item of pedidos) {
    const precioBase = item.precio * item.cantidad;
    const descuento = item.descuento ? precioBase * item.descuento : 0;
    const oferta = item.oferta ? item.oferta : 0;

    subtotal += precioBase;
    descuentoTotal += descuento;
    ofertaTotal += oferta;
  }

  const montoConDescuentos = subtotal - descuentoTotal - ofertaTotal;
  const igv = montoConDescuentos * igvPorcentaje;
  const totalFinal = montoConDescuentos + igv;

  return {
    subtotal,
    descuentoTotal,
    ofertaTotal,
    igv,
    totalFinal,
  };
}