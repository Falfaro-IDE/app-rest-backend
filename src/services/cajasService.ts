import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";

export const obtenerCajasGet = async (perfil: number) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listarCaja`, {
      params: {perfil: perfil} ,
      headers: getAuthHeaders(),
    });

    return data;
  } catch (error) {
    console.error("Error al obtener cajas:", error);
    throw error;
  }
};

export const crearCajasPost = async (cajaData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/registrarCaja`, // O la ruta correcta para crear producto
      cajaData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al registrar caja:", error);
    throw error;
  }
};

export const actualizarCajaPost = async (cajaData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarCaja`,
      cajaData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al actualizar caja:", error);
    throw error;
  }
};

