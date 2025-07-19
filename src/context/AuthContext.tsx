import { createContext, useState, useEffect } from "react";
import { StorageService } from "../utils/storageService";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [authSession, setAuthSession] = useState(StorageService.getItem("authSession"));

  useEffect(() => {
    setAuthSession(StorageService.getItem("authSession"));
  }, []);

  const login = (sessionData: any) => {
    StorageService.setItem("authSession", sessionData);
    setAuthSession(sessionData);
  };

  const logout = () => {
    StorageService.removeItem("authSession");
    setAuthSession(null);
  };

  return (
    <AuthContext.Provider value={{ authSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
