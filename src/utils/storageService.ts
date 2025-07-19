 import CryptoJS from "crypto-js";

  const SECRET_KEY = "ide_restaurant_123";

  const STORAGE_KEYS = {
    USER_DATA: "user_data",
  };

  export const StorageService = {
    setItem: (key: string, value: any) => {
      try {
        const jsonString = JSON.stringify(value);
        const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
        localStorage.setItem(key, encrypted);
      } catch (error) {
        console.error("Error al guardar en localStorage:", error);
      }
    },

    getItem: (key: string) => {
      try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;

        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decrypted);
      } catch (error) {
        console.error("Error al recuperar de localStorage:", error);
        return null;
      }
    },

    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error al eliminar de localStorage:", error);
      }
    },

    clear: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("Error al limpiar localStorage:", error);
      }
    },

    STORAGE_KEYS,
  };