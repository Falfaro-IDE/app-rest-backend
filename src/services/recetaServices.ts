import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";

export const obtenerRecetaGet = async (params: any) => {
    try {
        console.log("Obteniendo receta con params:", params);
        const queryParams: any = {};

        // Asegurarse de pasar el parámetro correcto para la receta
        if (params?.presentacion_id) {
            queryParams.presentacion_id = params.presentacion_id;
        }

        const { data } = await axios.get(`${API_BASE_URL}/listarReceta`, {
            headers: getAuthHeaders(),
            params: queryParams,
        });

        console.log("Datos obtenidos de la receta:", data);
        
        return data;
    } catch (error) {
        console.error("Error al obtener receta:", error);
        return [];
    }
};


export const crearRecetaPost = async (insumoData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarReceta`, // Aquí usé la ruta que usas en el primer código
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


export const actualizarRecetaPost = async (recetaData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarReceta`,
      recetaData,
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

