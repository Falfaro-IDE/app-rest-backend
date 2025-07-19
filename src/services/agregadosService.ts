import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { OBTENER_INSUMOS_GET } from "../models/clases/config";

export const obtenerAgregadoGet = async (params: any) => {
    try {
        console.log("Obteniendo Agregado con params:", params);
        const queryParams: any = {};

        // Asegurarse de pasar el parámetro correcto para la Agregado
        if (params?.presentacion_id) {
            queryParams.presentacion_id = params.presentacion_id;
        }

        const { data } = await axios.get(`${API_BASE_URL}/listarAgregado`, {
            headers: getAuthHeaders(),
            params: queryParams,
        });

        console.log("Datos obtenidos de la Agregado:", data);
        
        return data;
    } catch (error) {
        console.error("Error al obtener Agregado:", error);
        return [];
    }
};


export const crearAgregadoPost = async (insumoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarAgregado`, // Aquí usé la ruta que usas en el primer código
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


export const actualizarAgregadoPost = async (AgregadoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarAgregado`,
      AgregadoData,
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

