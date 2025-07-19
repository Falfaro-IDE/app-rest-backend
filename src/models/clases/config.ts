export const PISOS_KEYS = {
    MESAS_LIBRES: "cantidadMesasLibres",
    MESAS_OCUPADAS: "cantidadMesasOcupada",
    MESAS_PROCESO: "cantidadMesasProcesoPago",
    PISOS: "pisos",
  };
  
  export const PISO_KEYS = {
    ID: "id",
    DESCRIPCION: "descripcion",
    IMPRESORA: "impresora",
  };

  export const MESAS_GET = {
    ID: "idPiso",
  };

  export const MESAS_LISTA_KEYS = {
    cantidadPersonas    : "cantidadPersonas",
    descripcion         : "descripcion",
    estado              : "estado",
    fechaPedido         : "fechaPedido",
    horaPedido          : "horaPedido",
    id                  : "id",
    items               : "items",
  };

  export const SEPARAR_MESA_POST = {
    idMesa: "idMesa",
    numPersonas: "numPersonas",
  };

  export const OBTENER_PRESENTACIONES_GET = {
    categoria_id: "categoria_id",
    texto      : "texto",
    codigo: "codigo",
    tipo: "tipo",
  };

  export const OBTENER_INSUMOS_GET = {
    categoria_id: "categoria_id",
    texto      : "texto"
  };

  export const OBTENER_CONCEPTOCOMPROBANTE_GET = {
    con_prefijo: "con_prefijo"
  };
  
  export const OBTENER_PAGOCOMPRA_GET = {
    con_prefijo: "con_prefijo"
  };

  export const PRESENTACIONES = {
    codigoPresentacion: "codigoPresentacion",
    costo: "costo",
    criterio_stock: "criterio_stock",
    descripcion: "descripcion",
    idPresentacion: "idPresentacion",
    idProducto: "idProducto",
    img: "img",
    notas: "notas",
    stock: "stock",
    cortesia: "cortesia",
    control_stock: "control_stock"
  };

  export const CATEGORIAS = {
    empresa_id: "empresa_id",
    fecha_creacion: "fecha_creacion",
    hora_creacion: "hora_creacion",
    id: "id",
    imagen: "imagen",
    marca_baja: "marca_baja",
    nombre: "nombre",
    tipo: "tipo"
  };