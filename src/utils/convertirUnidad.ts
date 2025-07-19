const factoresConversion: Record<number, number> = {
  1: 1,       // Unidad
  2: 1,       // Kilo
  3: 0.001,   // Gramo -> 1 gramo = 0.001 kilo
  4: 1,       // Litro (base para volumen)
  5: 0.001,   // Mililitro -> 1 ml = 0.001 litro
  6: 100,     // Quintal -> 1 quintal = 100 kilos
};

export function convertirCantidad(
  cantidad: number,
  unidadOrigen: number,
  unidadBase: number
): number {
  const factorOrigen = factoresConversion[unidadOrigen];
  const factorBase = factoresConversion[unidadBase];

  if (!factorOrigen || !factorBase) {
    console.warn("Unidad no soportada en conversión:", unidadOrigen, unidadBase);
    return cantidad;
  }
  return (cantidad * factorOrigen) / factorBase;
}
