export interface Preparacion {
  id: number;
  cantidad: number;
  comentario: string;
  estado: number;
  fecha_preparacion: string;
  fecha_creacion: string;
  hora_creacion: string;
  estado_anterior: number;
  pedido: {
    id: number;
    tipo_despacho: string;
    mesa: {
      id: number;
      nro_mesa: string;
      salon: {
        id: number;
        nombre: string;
      };
    };
  };
  producto_presentacion: {
    id: number;
    descripcion: string;
  };
  usuario: {
    id: number;
    persona: {
      nombre: string;
    };
  };
}