
export class EstadoProducto {
    static readonly Activo = 0;
    static readonly Inactivo = 1;
}

export class TipoProducto {
    static readonly Almacenado = 1;
    static readonly Preparado = 2;
    static readonly Producto = "producto";
    static readonly Presentacion = "presentacion";

}

export const TiposProcesos: any = {
    1: "Ajuste de Stock (Entrada)",
    2: "Ajuste de Stock (Salida)",
    3: "Venta",
    4: "Compra",
};

export class TipoOperacion {
    static readonly Prefijo             = 5;
    static readonly AnularPedido        = {
        para_correlativo : 1,
        para_cadena1: "ANULAR PEDIDO",
        para_cadena2: "PEDIDO"
    };
    static readonly AnularAjusteStock   = {
        para_correlativo : 2,
        para_cadena1: "ANULAR AJUSTE STOCK",
        para_cadena2: "AJUSTE DE STOCK"
    };
}
export class RestablecerStock {
    static readonly si = 1;
    static readonly no = 2;
}

export class TipoDocumento {
    static readonly Prefijo             = 4;
    static readonly DNI        = {
        para_correlativo : 1,
        para_cadena1: "DNI",
    };
    static readonly RUC        = {
        para_correlativo : 2,
        para_cadena1: "RUC",
    };
    static readonly carnetExtranjeria        = {
        para_correlativo : 3,
        para_cadena1: "CARNET DE EXTRANJERÍA",
    };
    static readonly PASAPORTE        = {
        para_correlativo : 4,
        para_cadena1: "PASAPORTE",
    };
}

