import {
  CreateRegistroEnvaseRequest,
  RegistroEnvaseResponse,
  ApiError,
} from "../types/api";

const API_BASE_URL = "http://192.168.101.8:3300";
const API_TIMEOUT = 10000; // 10 seconds

class ProductionRecordsService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  async createRegistroEnvase(
    data: CreateRegistroEnvaseRequest,
  ): Promise<RegistroEnvaseResponse> {
    return this.makeRequest<RegistroEnvaseResponse>(
      "/api/production-records/envases",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  }
}

export const productionRecordsService = new ProductionRecordsService();

export const validateRegistroEnvase = (
  data: Partial<CreateRegistroEnvaseRequest>,
) => {
  const errors: string[] = [];

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

  if (!data.idUser) {
    errors.push("El ID de usuario es requerido");
  }

  if (data.fechaCreacion) {
    const date = new Date(data.fechaCreacion);
    if (isNaN(date.getTime())) {
      errors.push("El formato de fecha no es válido (use formato ISO)");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
