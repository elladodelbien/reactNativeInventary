import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://192.168.101.8:3300";
const API_TIMEOUT = 10000; // 10 seconds

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
    options: RequestInit = {},
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
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
            : errorData.message || `Error ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            "La petición ha excedido el tiempo límite. Verifique su conexión.",
          );
        }

        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new Error(
            "Error de conexión. Verifique que el servidor esté funcionando.",
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
        await this.makeRequest("/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.log("Error en logout del servidor:", error);
    } finally {
      // Limpiar datos locales siempre
      await this.clearAuthData();
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
      return await AsyncStorage.getItem("auth_token");
    } catch (error) {
      console.error("Error obteniendo token:", error);
      return null;
    }
  }

  async getUserData(): Promise<LoginResponse["user"] | null> {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
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
      await AsyncStorage.multiRemove(["auth_token", "user_data"]);
    } catch (error) {
      console.error("Error limpiando datos de autenticación:", error);
    }
  }

  // Método de utilidad para hacer requests autenticados
  async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
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