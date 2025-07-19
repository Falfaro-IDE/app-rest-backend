import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { InsumoPreparado } from "../models/clases/Insumo";

export const importarProductosPresentacionesPost = async (payload: {
  productos: any[];
  presentaciones: any[];
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/importarProductosPresentaciones`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al importar productos y presentaciones:", error);
    throw error;
  }
};

export const importarInsumosPost = async (insumos: InsumoPreparado[]) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/importarInsumos`,
      insumos,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al importar Insumos:", error);
    throw error;
  }
};

