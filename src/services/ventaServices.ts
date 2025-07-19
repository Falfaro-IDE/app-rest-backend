import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { MESAS_GET, OBTENER_PRESENTACIONES_GET, SEPARAR_MESA_POST } from "../models/clases/config";
import { PedidoClass } from "../models/clases/Pedido";
import { ProductoClass } from "../models/clases/Producto";

export const obtenerPisosGet = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerPisos`,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener pisos:", error);
    throw error;
  }
};

export const obtenerMesasGet = async (piso: any) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerMesas?${[MESAS_GET.ID]}=${piso.idPiso}`,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener mesas:", error);
    throw error;
  }
};

export const separaMesasPost = async (mesa:any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/separarMesa`, 
      {[SEPARAR_MESA_POST.idMesa]: mesa.idMesa, [SEPARAR_MESA_POST.numPersonas]: mesa.numPersonas },
      { headers: getAuthHeaders() }
    );
    return data;
  } catch (error) {
    console.error("Error al separa mesa:", error);
    throw error;
  }
};

// export const obtenerPresentacionesGet = async (categoria:any) => {
//   try {
//     const { data } = await axios.get(`${API_BASE_URL}/obtenerListaPresentaciones?${[OBTENER_PRESENTACIONES_GET.idCategoria]}=${categoria[OBTENER_PRESENTACIONES_GET.idCategoria]}`,{
//       headers: getAuthHeaders()
//   });
//     return data;
//   } catch (error) {
//     console.error("Error al obtener presentaciones:", error);
//     throw error;
//   }
// };

export const obtenerPresentacionesGet = async (categoria: any) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerListaPresentaciones`, {
      headers: getAuthHeaders(),
      params: {
        [OBTENER_PRESENTACIONES_GET.categoria_id]: categoria[OBTENER_PRESENTACIONES_GET.categoria_id]
      }
    });

    return data;
  } catch (error) {
    console.error("Error al obtener presentaciones:", error);
    throw error;
  }
};


export const obtenerPresentacionesTextoGet = async (texto:any) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerListaPresentacionesPorTexto?${[OBTENER_PRESENTACIONES_GET.texto]}=${texto[OBTENER_PRESENTACIONES_GET.texto]}`,{
      headers: getAuthHeaders()
  });
    return data;
  } catch (error) {
    console.error("Error al obtener texto:", error);
    throw error;
  }
};

export const obtenerCategoriasGet = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerCategorias`,{
      headers: getAuthHeaders()
  });
    return data;
  } catch (error) {
    console.error("Error al obtener texto:", error);
    throw error;
  }
};

export const registrarPedidoPost = async (pedido:PedidoClass) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarPedido`, 
      pedido,
      { headers: getAuthHeaders() }
    );    
    return data;
  } catch (error) {
    console.error("Error al separa mesa:", error);
    throw error;
  }
};

export const generarPreCuentaPost = async (pedido: PedidoClass) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/generarPreCuenta`, 
      pedido,
      { headers: getAuthHeaders() }
    );  
    return data;
  } catch (error) {
    console.error("Error al separa mesa:", error);
    throw error;
  }
}

export const obtenerNotasGet = async (producto:ProductoClass) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerNotas?idProducto=${producto.producto_id}`,{
      headers: getAuthHeaders()
  });
    return data;
  } catch (error) {
    console.error("Error al obtener texto:", error);
    throw error;
  }
};

export const registrarNotasPost = async (producto:ProductoClass) => {
  console.log("QUE LLEGA", producto)
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarNota`, 
      producto,
      { headers: getAuthHeaders() }
    );
    return data;
  } catch (error) {
    console.error("Error al separa mesa:", error);
    throw error;
  }
};

// export const obtenerPedidosGet = async (pedido:any) => {
//   try {
//     const { data } = await axios.get(`${API_BASE_URL}/obtenerPedido?id=${pedido.id}`,{
//       headers: getAuthHeaders()
//   });
//     return data;
//   } catch (error) {
//     console.error("Error al obtener texto:", error);
//     throw error;
//   }
// };

export const obtenerPedidosGet = async (pedido: any) => {
  try {
    const params = new URLSearchParams();

    if (pedido.id !== undefined) {
      params.append("id", pedido.id);
    }

    const { data } = await axios.get(
      `${API_BASE_URL}/obtenerPedido${params.toString() ? `?${params.toString()}` : ""}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return data;
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    throw error;
  }
};



export const actualizarPedidoPost = async (pedido:PedidoClass) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarPedido`,
      pedido,
      { headers: getAuthHeaders() }
    );
    return data;
  } catch (error) {
    console.error("Error al separa mesa:", error);
    throw error;
  }
};

export const obtenerDetallePedidoGet = async (pedido:any) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerDetallePedido?pedido_id=${pedido.id}&producto_id=${pedido.producto_id}`,{
      headers: getAuthHeaders()
  });
    return data;
  } catch (error) {
    console.error("Error al obtener texto:", error);
    throw error;
  }
};

export const eliminarPedidoCompletoPost = async (pedido:any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/eliminarOrdenCompleta`, pedido, {
      headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al eliminar pedido: ", error);
    throw error;
  }
};

export const eliminarDetallePedidoPost = async (detalle:any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/eliminarDetallePedido`, 
      detalle,
      { headers: getAuthHeaders() }
    );
    return data;
  } catch (error) {
    console.error("Error al separa mesa:", error);
    throw error;
  }
};

export const eliminarNotaPost = async (nota: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/eliminarNota`,
      nota,
      { headers: getAuthHeaders() }
    );
    return data;
  } catch (error) {
    console.error("Error al separa mesa:", error);
    throw error;
  }
};


