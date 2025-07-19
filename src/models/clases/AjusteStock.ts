export class AjusteStockClass {
    id ?: number = 0;
    tipo_ajuste? : number = 0;
    tipo_operacion? : number = 0;
    empresa_id? : number = 0;
    pedido_id? : number = 0;
    compra_id? : number = 0;
    responsable_id? : number = 0;
    usuario_id? : number = 0;
    descripcion? : string = '';
    estado? : number = 0;
    marca_baja? : number = 0;
    fecha_ajuste? : string = '';
    hora_ajuste? : string = '';
    fecha_creacion? : string = '';
    hora_creacion? : string = '';
    fechaInicio? : string = '';
    fechaFin? : string = '';
    tipo_ajuste_descripcion? : string = '';
    responsable_nombre? : string = '';
    detalleAjusteStock : DetalleAjusteStockClass[] = [];
}

export class DetalleAjusteStockClass {
    producto_presentacion_id? : number | null = 0;
    insumo_id? : number | null = 0;
    cantidad?  : number = 0;
    stock_anterior? : number = 0;
    stock_nuevo? : number = 0;
    marca_baja? : number = 0;
    precio_unitario? : number = 0;
    producto?: string | null = '';
    unidad?: string | null = '';
}

