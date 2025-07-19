export class ProductoClass {
    usuario_id: number = 0;
    producto_id: number = 0;
    producto_presentacion_id: number = 0;
    comentario : string = '';
    cantidad: number = 0;
    precio: number = 0;
    precioOriginal: number = 0;
    orden: number = 0;
    fecha_creacion: string = '';
    hora_creacion: string = '';
    stock: number = 0;
    img: string = '';
    criterio_stock: number = 0;
    descripcion: string = '';
    codigoPresentacion: string = '';
    idUnico: string = '';
    contieneNotas?: boolean = false;
    notas:string = '';
    idProducto: number = 0;
    fecha_pedido: string = '';
    hora_pedido: string = '';
    cortesia: number = 0;
    selectCortesia: boolean = false;
    control_stock?: number = 0;
}

export class Categoria {
  id!: number;
  nombre!: string;
  tipo!: number;

  constructor(init?: Partial<Categoria>) {
    this.id = 0;
    this.nombre = "";
    this.tipo = 0;
    Object.assign(this, init);
  }
}

export class AreaProduccion {
  id!: number;
  nombre!: string;

  constructor(init?: Partial<AreaProduccion>) {
    this.id = 0;
    this.nombre = "";
    Object.assign(this, init);
  }
}

export class ProductoPresentacion {
  id?: number;
  presentacion_cod!: string;
  descripcion!: string;
  precio!: number;
  imagen!: string;
  stock!: number;
  costo!: number;
  estado!: number; // 0 = activo, 1 = inactivo
  agregados!: number; // 0 = sí tiene agregados, 1 = no
  control_stock!: number; // 0 = sí controla stock, 1 = no
  producto_id!: number;
  fecha_creacion!: string; // formato ISO o yyyy-MM-dd
  usuario_id!: number;
  receta!: number;

  constructor(init?: Partial<ProductoPresentacion>) {
    this.presentacion_cod = "";
    this.descripcion = "";
    this.precio = 0;
    this.imagen = "";
    this.stock = 0;
    this.costo = 0;
    this.estado = 0;
    this.agregados = 1;
    this.control_stock = 1;
    this.producto_id = 0;
    this.fecha_creacion = "";
    this.usuario_id = 0;
    this.receta = 1;

    Object.assign(this, init);
  }
}


export class ProductoSoloClass {
  id!: number;
  nombre!: string;
  notas!: string;
  tipo_producto!: number;
  categoria!: Categoria;
  area_produccion!: AreaProduccion;
  estado!: number;
  codigo!: string;
  productos_presentacion!: ProductoPresentacion[];

  constructor(init?: Partial<ProductoSoloClass>) {
    this.nombre = "";
    this.notas = "";
    this.tipo_producto = 0;
    this.categoria = new Categoria();
    this.area_produccion = new AreaProduccion();
    this.productos_presentacion = [];
    Object.assign(this, init);

    // Por si se pasa init con objetos planos y no instancias:
    if (init?.categoria && !(init.categoria instanceof Categoria)) {
      this.categoria = new Categoria(init.categoria);
    }
    if (init?.area_produccion && !(init.area_produccion instanceof AreaProduccion)) {
      this.area_produccion = new AreaProduccion(init.area_produccion);
    }
    if (init?.productos_presentacion) {
      this.productos_presentacion = init.productos_presentacion.map(
        p => p instanceof ProductoPresentacion ? p : new ProductoPresentacion(p)
      );
    }
  }
}

export interface ProductoPreparado {
  codigo: string;
  nombre: string;
  categoria_id: number;
  id_area_produccion: number;
  tipo_producto: number;
  notas: string[];
  estado: number;
  fecha_creacion: string;
  hora_creacion: string;
}

export interface PresentacionPreparada {
  producto_codigo?: string; 
  producto_id?: number;
  presentacion_cod: string;
  descripcion: string;
  precio: number;
  costo: number;
  receta: number;
  agregados: number;
  control_stock: number;
  stock: number;
  estado: number;
  fecha_creacion: string;
  hora_creacion: string;
  imagen: string;
}



export class Tipo {
    static readonly Almacenable = 1;
    static readonly Preparado = 2;
}
