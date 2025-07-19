import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { OBTENER_PRESENTACIONES_GET } from "../models/clases/config";

export const obtenerPresentacionesGet = async (params: any) => {
  try {
    const queryParams: any = {};

    if (params?.[OBTENER_PRESENTACIONES_GET.categoria_id]) {
      queryParams[OBTENER_PRESENTACIONES_GET.categoria_id] =
        params[OBTENER_PRESENTACIONES_GET.categoria_id];
    }

    if (params?.[OBTENER_PRESENTACIONES_GET.codigo]) {
      queryParams[OBTENER_PRESENTACIONES_GET.codigo] =
        params[OBTENER_PRESENTACIONES_GET.codigo];
    }

    if (params?.[OBTENER_PRESENTACIONES_GET.tipo]) {
      queryParams[OBTENER_PRESENTACIONES_GET.tipo] =
        params[OBTENER_PRESENTACIONES_GET.tipo];
    }

    const { data } = await axios.get(`${API_BASE_URL}/listarProductos`, {
      headers: getAuthHeaders(),
      params: queryParams,
    });

    return data;
  } catch (error) {
    console.error("Error al obtener presentaciones:", error);
    throw error;
  }
};

export const obtenerPresentacionesTextoGet = async (texto: any, tipo?: number) => {
  try {
    console.log(tipo);
    
    const queryParams = new URLSearchParams();
    queryParams.append(OBTENER_PRESENTACIONES_GET.texto, texto);

    if (tipo !== undefined && tipo !== null) {
      queryParams.append("tipo", tipo.toString());
    }

    const { data } = await axios.get(
      `${API_BASE_URL}/obtenerListaPresentacionesPorTexto?${queryParams.toString()}`,
      {
        headers: getAuthHeaders()
      }
    );

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

export const actualizarProductoPost = async (productoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarProducto`,
      productoData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

export const actualizarPresentacionPost = async (presentacionData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarPresentacion`,
      presentacionData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al actualizar presentacion:", error);
    throw error;
  }
};

export const crearProductoPost = async (productoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarProducto`, // O la ruta correcta para crear producto
      productoData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al registrar producto:", error);
    throw error;
  }
};

export const crearPresentacionPost = async (productoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarPresentacion`, // O la ruta correcta para crear producto
      productoData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al registrar producto:", error);
    throw error;
  }
};


