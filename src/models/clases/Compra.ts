// ProveedorDto
export class ProveedorDto {
  id!: number;
  nombre!: string;
  ruc!: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado!: number;
  fecha_creacion?: string;
  hora_creacion?: string;

  constructor(init?: Partial<ProveedorDto>) {
    Object.assign(this, {
      nombre: "",
      ruc: "",
      estado: 0,
      ...init,
    });
  }
}

// PersonaDto
export class PersonaDto {
  id!: number;
  nombre!: string;

  constructor(init?: Partial<PersonaDto>) {
    Object.assign(this, {
      nombre: "",
      ...init,
    });
  }
}

// UsuarioDto
export class UsuarioDto {
  id!: number;
  usuario!: string;
  persona!: PersonaDto;

  constructor(init?: Partial<UsuarioDto>) {
    this.usuario = init?.usuario || "";
    this.persona = init?.persona instanceof PersonaDto
      ? init.persona
      : new PersonaDto(init?.persona);
    Object.assign(this, init);
  }
}

// DetalleCompraDto
export class DetalleCompraDto {
  id?: number;
  producto_presentacion_id!: number;
  insumo_id?: number;
  unidad?: number;
  cantidad!: number;
  precio_unitario?: number;
  total?: number;
  fecha_creacion?: string;
  hora_creacion?: string;

  constructor(init?: Partial<DetalleCompraDto>) {
    Object.assign(this, {
      producto_presentacion_id: undefined,
      cantidad: 0,
      precio_unitario: 0,
      total: 0,
      unidad: 0,
      insumo_id: undefined,
      fecha_creacion: "",
      hora_creacion: "",
      ...init,
    });
  }
}

// CompraDto
export class CompraDto {
  id?: number;
  tipo!: number;
  documento!: number;
  serie!: string;
  numero!: string;
  fecha?: string;
  hora?: string;
  proveedor?: ProveedorDto;
  usuario?: UsuarioDto;
  descuento?: number;
  total!: number;
  cuotas?: number | null;
  estado!: number;
  fecha_creacion?: string;
  hora_creacion?: string;
  detalles: DetalleCompraDto[] = [];
  documentoDescripcion: string;
  tipoDescripcion: string;

  constructor(init?: Partial<CompraDto>) {
    this.tipo = init?.tipo ?? 0;
    this.documento = init?.documento ?? 0;
    this.serie = init?.serie ?? "";
    this.numero = init?.numero ?? "";
    this.fecha = init?.fecha ?? "";
    this.hora = init?.hora ?? "";
    this.descuento = init?.descuento ?? 0;
    this.total = init?.total ?? 0;
    this.estado = init?.estado ?? 0;
    this.fecha_creacion = init?.fecha_creacion ?? "";
    this.hora_creacion = init?.hora_creacion ?? "";
    this.documentoDescripcion = init?.documentoDescripcion ?? "";
    this.tipoDescripcion = init?.tipoDescripcion ?? "";

    this.proveedor = init?.proveedor instanceof ProveedorDto
      ? init.proveedor
      : init?.proveedor
        ? new ProveedorDto(init.proveedor)
        : undefined;

    this.usuario = init?.usuario instanceof UsuarioDto
      ? init.usuario
      : init?.usuario
        ? new UsuarioDto(init.usuario)
        : undefined;

    this.detalles = (init?.detalles || []).map(
      (d) => d instanceof DetalleCompraDto ? d : new DetalleCompraDto(d)
    );
  }
}

export class CompraRegistrarDto {
  tipo!: number;
  documento!: number;
  serie!: string;
  numero!: string;
  fecha?: string;
  hora?: string;
  proveedor_id?: number;
  descuento?: number;
  total!: number;
  cuotas?: number | null;
  estado!: number;
  fecha_creacion?: string;
  hora_creacion?: string;
  detalles: DetalleCompraDto[] = [];
  fechaInicio? : string = '';
  fechaFin? : string = '';

  constructor(init?: Partial<CompraRegistrarDto>) {
    this.tipo = init?.tipo ?? 0;
    this.documento = init?.documento ?? 0;
    this.serie = init?.serie ?? "";
    this.numero = init?.numero ?? "";
    this.fecha = init?.fecha ?? "";
    this.hora = init?.hora ?? "";
    this.descuento = init?.descuento ?? 0;
    this.proveedor_id = init?.proveedor_id ?? 0;
    this.total = init?.total ?? 0;
    this.estado = init?.estado ?? 0;
    this.fecha_creacion = init?.fecha_creacion ?? "";
    this.hora_creacion = init?.hora_creacion ?? "";

    this.detalles = (init?.detalles || []).map(
      (d) => d instanceof DetalleCompraRegistrarDto ? d : new DetalleCompraRegistrarDto(d)
    );
  }
}

export class DetalleCompraRegistrarDto {
  producto_presentacion_id!: number;
  insumo_id?: number;
  unidad?: number;
  cantidad!: number;
  precio_unitario?: number;
  total?: number;
  fecha_creacion?: string;
  hora_creacion?: string;

  constructor(init?: Partial<DetalleCompraRegistrarDto>) {
    Object.assign(this, {
      producto_presentacion_id: null,
      cantidad: 0,
      precio_unitario: 0,
      total: 0,
      unidad: 0,
      insumo_id: null,
      fecha_creacion: "",
      hora_creacion: "",
      ...init,
    });
  }
}
