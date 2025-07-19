import { StorageService } from "../utils/storageService";
import values from "../models/clases/values";

export const getAuthHeaders = (extraHeaders = {}) => {
  const token = StorageService.getItem(values.storage.keySession)?.objeto?.token;

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
    ...extraHeaders,
  };
};