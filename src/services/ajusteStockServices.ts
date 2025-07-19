import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { AjusteStockClass } from "../models/clases/AjusteStock";

export const listarAjusteStockGet = async (ajuste:AjusteStockClass) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listarAjustesStock?fechaInicio=${ajuste.fechaInicio}&fechaFin=${ajuste.fechaFin}`,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener ajuste de stock:", error);
    throw error;
  }
};

export const registrarAjusteStockPost = async (ajuste:AjusteStockClass) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/registrarAjusteStock`,ajuste,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener ajuste de stock:", error);
    throw error;
  }
};


export const anularAjusteStockPost = async (ajuste:AjusteStockClass) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/anularAjusteStock`,ajuste,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener ajuste de stock:", error);
    throw error;
  }
};
