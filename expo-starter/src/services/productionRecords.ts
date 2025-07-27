import {
  CreateRegistroEnvaseRequest,
  RegistroEnvaseResponse,
  ApiError,
} from "../types/api";
import { authService } from "./authService";

const API_BASE_URL = "http://192.168.101.8:3300";
const API_TIMEOUT = 10000; // 10 seconds

class ProductionRecordsService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      let headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      // Agregar token de autenticación si es requerido
      if (requireAuth) {
        const token = await authService.getToken();
        console.log("ProductionRecords - Token obtenido:", token ? "Token presente" : "No hay token");
        
        if (!token) {
          throw new Error("Usuario no autenticado. Inicie sesión nuevamente.");
        }
        
        headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };
        
        console.log("ProductionRecords - Headers con token configurados");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          throw new Error("Sesión expirada. Inicie sesión nuevamente.");
        }
        
        if (response.status === 403) {
          throw new Error("No tiene permisos para realizar esta acción.");
        }

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

  async createRegistroEnvase(
    data: CreateRegistroEnvaseRequest,
  ): Promise<RegistroEnvaseResponse> {
    console.log("=== DEBUG REGISTRO ENVASES ===");
    
    // Verificar que el usuario esté autenticado y tenga permisos
    const userData = await authService.getUserData();
    console.log("ProductionRecords - Datos de usuario:", userData);
    
    if (!userData) {
      throw new Error("Usuario no autenticado");
    }

    // Verificar permisos de cargo
    const cargosPermitidos = [
      "Operario de Planta",
      "Supervisor de Área", 
      "Gerente de Producción"
    ];
    
    console.log("ProductionRecords - Cargo del usuario:", userData.cargo);
    console.log("ProductionRecords - Cargos permitidos:", cargosPermitidos);
    
    if (!cargosPermitidos.includes(userData.cargo)) {
      throw new Error("No tiene permisos para registrar envases");
    }

    // Asegurar que el idUser sea del usuario autenticado
    const payload = {
      ...data,
      idUser: userData.id,
    };

    console.log("ProductionRecords - Payload a enviar:", payload);

    return this.makeRequest<RegistroEnvaseResponse>(
      "/api/production-records/envases",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }
}

export const productionRecordsService = new ProductionRecordsService();

export const validateRegistroEnvase = (
  data: Partial<CreateRegistroEnvaseRequest>,
) => {
  const errors: string[] = [];

  // Validar campos obligatorios según documentación del backend
  if (!data.cantidadDeMaterialUsado || data.cantidadDeMaterialUsado <= 0) {
    errors.push("La cantidad de material usado debe ser mayor a 0");
  }

  if (
    !data.cantidadDeEnvasesProducidos ||
    data.cantidadDeEnvasesProducidos <= 0
  ) {
    errors.push("La cantidad de envases producidos debe ser mayor a 0");
  }

  if (!data.horasTrabajadas || data.horasTrabajadas < 1) {
    errors.push("Las horas trabajadas deben ser mínimo 1");
  }

  // Validar que sean números enteros
  if (data.cantidadDeMaterialUsado && !Number.isInteger(data.cantidadDeMaterialUsado)) {
    errors.push("La cantidad de material debe ser un número entero");
  }

  if (data.cantidadDeEnvasesProducidos && !Number.isInteger(data.cantidadDeEnvasesProducidos)) {
    errors.push("La cantidad de envases debe ser un número entero");
  }

  if (data.horasTrabajadas && !Number.isInteger(data.horasTrabajadas)) {
    errors.push("Las horas trabajadas deben ser un número entero");
  }

  // Validar fecha si se proporciona
  if (data.fechaCreacion) {
    const date = new Date(data.fechaCreacion);
    if (isNaN(date.getTime())) {
      errors.push("El formato de fecha no es válido (use formato ISO)");
    }
  }

  // Validar IDs requeridos
  if (!data.idOperario || !Number.isInteger(data.idOperario) || data.idOperario <= 0) {
    errors.push("El ID del operario es requerido y debe ser un número entero positivo");
  }

  if (!data.idProducto || !Number.isInteger(data.idProducto) || data.idProducto <= 0) {
    errors.push("El ID del producto es requerido y debe ser un número entero positivo");
  }

  if (!data.idMaterial || !Number.isInteger(data.idMaterial) || data.idMaterial <= 0) {
    errors.push("El ID del material es requerido y debe ser un número entero positivo");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
