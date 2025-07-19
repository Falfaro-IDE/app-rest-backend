import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { OBTENER_INSUMOS_GET } from "../models/clases/config";

export const obtenerProveedoresGet = async (params: any) => {
  try {
    const queryParams: any = {};

    // // Verificar si hay texto de búsqueda
    // if (params?.texto || params?.search) {
    //   queryParams.texto = params.texto || params.search;
    // }

    const { data } = await axios.get(`${API_BASE_URL}/obtenerProveedores`, {
      headers: getAuthHeaders(),
      params: queryParams,
    });

    return data;
  } catch (error) {
    console.error("Error al obtener compras:", error);
    throw error;
  }
};

export const crearCompraPost = async (insumoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarCompra`, // O la ruta correcta para crear producto
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

// export const actualizarInsumoPost = async (insumoData: any) => {
//   try {
//     const { data } = await axios.post(
//       `${API_BASE_URL}/actualizarInsumo`,
//       insumoData,
//       {
//         headers: getAuthHeaders(),
//       }
//     );
//     return data;
//   } catch (error) {
//     console.error("Error al actualizar insumo:", error);
//     throw error;
//   }
// };

