import { ProductoClass } from "./Producto";

export class PedidoClass {
    tipo_despacho_id: number = 0;
    empresa_id: number = 0;
    apert_cierre_caja_id: number = 0;
    usuario_id: number = 0;
    mesa_id: number = 0;
    nombre_cliente: string = '';
    fecha_pedido: string = '';
    hora_pedido: string = '';
    estado: number = 0;
    orden:number = 0;
    fecha_creacion: string = '';
    hora_creacion: string = '';
    detallePedido : DetallePedidoClass[] = [];
    nombre_mesa? : string = '';
    nombre_salon? : string = '';
    monto_total: number = 0;
    subtotal?: number = 0;
    descuento?: number = 0;
    oferta?: number = 0;
    igv?: number = 0;
    cortesia?: number = 0;
    impresora_id?: number = 0;
}

export class DetallePedidoClass {
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
    fecha_detalle: string = '';
    hora_detalle: string = '';
    stock: number = 0;
    img: string = '';
    criterio_stock: number = 0;
    descripcion: string = '';
    codigoPresentacion: string = '';
    contieneNotas?: boolean = false;
    idUnico: string = '';
    marca_baja?: number = 0;
    notas:string = '';
    idProducto: number = 0;
    cortesia: number = 0;
    selectCortesia: boolean = false;
}