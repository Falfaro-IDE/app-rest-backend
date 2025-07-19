import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { CompraRegistrarDto } from "../models/clases/Compra";

export const obtenerComprasGet = async (params: CompraRegistrarDto) => {
  try {
    const queryParams: any = {};

    if (params.fechaInicio) queryParams.fechaInicio = params.fechaInicio;
    if (params.fechaFin) queryParams.fechaFin = params.fechaFin;

    const { data } = await axios.get(`${API_BASE_URL}/obtenerCompras`, {
      headers: getAuthHeaders(),
      params: queryParams,
    });

    return data;
  } catch (error) {
    console.error("Error al obtener compras:", error);
    throw error;
  }
};


export const crearCompraPost = async (dataCompra: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarCompra`, // O la ruta correcta para crear producto
      dataCompra,
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

