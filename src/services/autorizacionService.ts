import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";

export const validarOperacionService = async (payload: any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/validarOperacion`, payload, {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    console.error("Error en validarOperacionService:", error);
    throw error;
  }
};

export const validarPinService = async (payload: any) => {
  console.log("payload", payload);
  try {
    const { data } = await axios.post(`${API_BASE_URL}/validarPin`, payload, {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    console.error("Error en validarPinService:", error);
    throw error;
  }
};