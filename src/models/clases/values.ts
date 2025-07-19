const hostname = window.location.hostname;
const parts = hostname.split(".");

export default {
    message: {
        cathError   : "Error de conexión, intente nuevamente.",
        exito       : "Inicio de sesión exitoso"
    },
    carpetasS3: {
        linkS3      : import.meta.env.VITE_API_S3_URL,
        carpeta     : "imagenes/",
        logo        : "-logo.jpg",
        portada     : "-portada.jpg"

    },
    storage: {
        keySession      : "authSession",
        menuSession     : "authMenu"
    },
    rutas : {
        subnodmino          : parts[0],
        rutaHome            : "/rest",
        enviarCorreo        : "/enviarCorreo",
        resetPassword       : "/resetPassword",
        rutasTodos          : ["/rest/bienvenida", "login",],
        rutas              : {
            "login": "/login",
            "enviarCorreo"  : "/enviarCorreo",
            "resetPassword" : "/resetPassword/:token",
            "homePrincipal" : {
                "rutaPrincipal" : "/rest",
                "bienvenida"    : "/bienvenida",
                "venta"         : "/punto_venta",
                "pedido"        : "/punto_venta/pedido",
                "pagoVenta"        : "/punto_venta/pedido/pagoVenta",
                "produccion"    : "/produccion",
                "ajustes"    : {
                    "productos": "/ajustes/productos",
                    "cajas": "/ajustes/caja",
                    "configuracion": "/ajustes/sistema"
                },
                // "inventario"    : "/inventario",
                "inventario"    : {                    
                    "stock" : "/inventario/stock",
                },
                "ajuste_stock"  : {
                    "lista": "/inventario/ajuste_stock",
                    "nuevo": "/inventario/nuevo_stock"
                },
                "compra" : {
                    "listadocompra":"/compras/todas_compras",
                    "nuevacompra":"/compras/nuevaCompra",
                },
                "informes" : {
                    "inventario":"/informes/inventario",
                    "stock_movimiento_producto":"/informes/inventario/stock_movimiento_producto",
                    "inventario_kardex":"/informes/inventario/inventario_kardex",
                    "ventas":"/informes/ventas",
                    "margen_de_ganacia":"/informes/ventas/ganacias",
                },
                "caja" : {
                    "aperturaCierreCaja" : "/caja/apertura_cierre"
                },
                "clientes" : {
                    "lista":"/clientes",
                }
            }
        },
    },
    numeros:{
        decimales: 2,
        decimalesKardex: 4
    }

}