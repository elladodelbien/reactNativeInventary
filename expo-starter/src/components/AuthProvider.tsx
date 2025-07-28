import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { User } from "../utils/permissions";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si hay token almacenado
      const hasToken = await authService.isAuthenticated();
      
      if (hasToken) {
        // Intentar obtener datos del usuario
        const userData = await authService.getUserData();
        if (userData) {
          setUser(userData as User);
        } else {
          // Si no hay datos de usuario, intentar obtenerlos del servidor
          try {
            const profile = await authService.getProfile();
            setUser(profile as User);
          } catch (error) {
            // Token inválido o expirado, limpiar
            await authService.logout();
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user as User);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("AuthProvider - Iniciando logout...");
      await authService.logout();
      console.log("AuthProvider - Limpiando estado de usuario...");
      setUser(null);
      console.log("AuthProvider - Usuario deslogueado exitosamente");
    } catch (error) {
      console.error("AuthProvider - Error en logout:", error);
      // Incluso si hay error, limpiar el estado local
      setUser(null);
      console.log("AuthProvider - Estado de usuario limpiado por error");
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile as User);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      // Si falla la actualización, mantener el usuario actual
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}