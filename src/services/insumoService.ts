import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { OBTENER_INSUMOS_GET } from "../models/clases/config";

// export const obtenerInsumosGet = async (params: any) => {
//     try {
//         console.log("Obteniendo insumos con categoriaId:", params);
//         const queryParams: any = {};
        
//         if (params?.[OBTENER_INSUMOS_GET.categoria_id]) {
//             queryParams[OBTENER_INSUMOS_GET.categoria_id] = params[OBTENER_INSUMOS_GET.categoria_id];
//         }
//         const { data } = await axios.get(`${API_BASE_URL}/listarInsumo`, {
//         headers: getAuthHeaders(),
//         params: queryParams,
//         });
//         return data;
//     } catch (error) {
//         console.error("Error al obtener insumos por categoría:", error);
//         throw error;
//     }
// };

export const obtenerInsumosGet = async (params: any) => {
  try {
    console.log("Obteniendo insumos con parámetros:", params);
    const queryParams: any = {};

    // Verificar si hay categoría
    if (params?.[OBTENER_INSUMOS_GET.categoria_id]) {
      queryParams[OBTENER_INSUMOS_GET.categoria_id] = params[OBTENER_INSUMOS_GET.categoria_id];
    }

    // Verificar si hay texto de búsqueda
    if (params?.texto || params?.search) {
      queryParams.texto = params.texto || params.search;
    }

    // Verificar si hay código
    if (params?.codigo) {
      queryParams.codigo = params.codigo;
    }

    const { data } = await axios.get(`${API_BASE_URL}/listarInsumo`, {
      headers: getAuthHeaders(),
      params: queryParams,
    });

    return data;
  } catch (error) {
    console.error("Error al obtener insumos:", error);
    throw error;
  }
};



export const crearInsumoPost = async (insumoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarInsumo`, // O la ruta correcta para crear producto
      insumoData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al registrar insumo:", error);
    throw error;
  }
};

export const actualizarInsumoPost = async (insumoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarInsumo`,
      insumoData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al actualizar insumo:", error);
    throw error;
  }
};

