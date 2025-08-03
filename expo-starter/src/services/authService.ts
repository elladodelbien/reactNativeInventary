import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_BASE_URL = "http://192.168.1.75:3300";
const API_BASE_URL = "https://production-records-backend.vercel.app";

const API_TIMEOUT = 30000; // 30 seconds para desarrollo local

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    cargo: string;
    telefono: string;
    activo: boolean;
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    // http://localhost:3300/api/auth/login
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          Array.isArray(errorData.message)
            ? errorData.message.join(", ")
            : errorData.message || `Error ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            `La petición ha excedido el tiempo límite de ${API_TIMEOUT / 1000} segundos. Verifique:\n1. Que el servidor esté funcionando en ${API_BASE_URL}\n2. Su conexión a internet\n3. Que esté conectado a la red correcta`
          );
        }

        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new Error(
            `Error de conexión al servidor ${API_BASE_URL}. Verifique:\n1. Que el servidor backend esté ejecutándose\n2. Que la IP y puerto sean correctos\n3. Su conexión de red`
          );
        }

        throw error;
      }

      throw new Error("Error desconocido en la petición");
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Guardar token y datos del usuario
    await this.storeAuthData(response);

    return response;
  }

  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout del backend
      const token = await this.getToken();
      if (token) {
        console.log("AuthService - Enviando logout al servidor...");
        await this.makeRequest("/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("AuthService - Logout del servidor exitoso");
      }
    } catch (error) {
      console.log("AuthService - Error en logout del servidor:", error);
    } finally {
      // Limpiar datos locales siempre (incluso si falla el logout del servidor)
      console.log("AuthService - Limpiando datos locales...");
      await this.clearAuthData();
      console.log("AuthService - Logout completado");
    }
  }

  async getProfile(): Promise<LoginResponse["user"]> {
    const token = await this.getToken();
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    return this.makeRequest<LoginResponse["user"]>("/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async refreshToken(): Promise<LoginResponse> {
    const token = await this.getToken();
    if (!token) {
      throw new Error("No hay token para renovar");
    }

    const response = await this.makeRequest<LoginResponse>("/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Actualizar token almacenado
    await this.storeAuthData(response);

    return response;
  }

  // Métodos para manejo de datos locales
  private async storeAuthData(authData: LoginResponse): Promise<void> {
    try {
      await AsyncStorage.setItem("auth_token", authData.access_token);
      await AsyncStorage.setItem("user_data", JSON.stringify(authData.user));
    } catch (error) {
      console.error("Error guardando datos de autenticación:", error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      console.log(
        "AuthService - getToken():",
        token
          ? `Token encontrado (${token.substring(0, 20)}...)`
          : "No hay token"
      );
      return token;
    } catch (error) {
      console.error("Error obteniendo token:", error);
      return null;
    }
  }

  async getUserData(): Promise<LoginResponse["user"] | null> {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      console.log(
        "AuthService - getUserData():",
        userData ? "Datos de usuario encontrados" : "No hay datos de usuario"
      );
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log("AuthService - Datos parseados:", parsedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  private async clearAuthData(): Promise<void> {
    try {
      // Limpiar todas las claves relacionadas con autenticación
      const keysToRemove = ["auth_token", "user_data"];
      await AsyncStorage.multiRemove(keysToRemove);
      console.log(
        "AuthService - Datos de autenticación limpiados completamente"
      );

      // Verificar que efectivamente se limpiaron
      const remainingToken = await AsyncStorage.getItem("auth_token");
      const remainingUserData = await AsyncStorage.getItem("user_data");

      if (!remainingToken && !remainingUserData) {
        console.log(
          "AuthService - Verificación exitosa: No quedan datos de sesión"
        );
      } else {
        console.warn("AuthService - Advertencia: Aún quedan datos residuales");
      }
    } catch (error) {
      console.error(
        "AuthService - Error limpiando datos de autenticación:",
        error
      );
      // En caso de error, intentar limpieza completa como fallback
      try {
        await AsyncStorage.clear();
        console.log(
          "AuthService - Limpieza completa de AsyncStorage realizada como fallback"
        );
      } catch (clearError) {
        console.error(
          "AuthService - Error crítico: No se pudo limpiar AsyncStorage",
          clearError
        );
      }
    }
  }

  // Función de debug para limpiar completamente el storage
  async clearAllData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log("AuthService - Todas las claves en storage:", keys);
      await AsyncStorage.clear();
      console.log("AuthService - Storage completamente limpiado");
    } catch (error) {
      console.error("Error limpiando storage completo:", error);
    }
  }

  // Método de utilidad para hacer requests autenticados
  async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authService = new AuthService();

// Función de validación para el formulario de login
export const validateLoginForm = (data: Partial<LoginRequest>) => {
  const errors: string[] = [];

  if (!data.email || data.email.trim() === "") {
    errors.push("El email es requerido");
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("El formato del email no es válido");
  }

  if (!data.password || data.password.trim() === "") {
    errors.push("La contraseña es requerida");
  } else if (data.password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
