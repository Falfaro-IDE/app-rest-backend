import { Categoria } from "./Producto";

export class InsumoClass {
  id!: number;
  nombre!: string;
  codigo!: string;
  unidad_medida!: number;
  costo_unitario!: number;
  stock_minimo!: number;
  estado!: number;
  categoria!: Categoria;

  constructor(init?: Partial<InsumoClass>) {
    this.nombre = "";
    this.codigo = "";
    this.unidad_medida = 0;
    this.costo_unitario = 0;
    this.stock_minimo = 0;
    this.estado = 0;
    this.categoria = new Categoria();
    Object.assign(this, init);

    // Por si se pasa init con objetos planos y no instancias:
    if (init?.categoria && !(init.categoria instanceof Categoria)) {
      this.categoria = new Categoria(init.categoria);
    }
  }
}


export class Tipo {
    static readonly Producto = 1;
    static readonly Insumo = 2;
}

export interface InsumoPreparado {
  codigo: string;
  nombre: string;
  notas?: string;
  categoria_id: number;
  id_area_produccion: number;
  tipo_producto: number;
  estado?: number;
  fecha_creacion?: string;
  hora_creacion?: string;
  empresa_id?: number;
  usuario_id?: number;
}