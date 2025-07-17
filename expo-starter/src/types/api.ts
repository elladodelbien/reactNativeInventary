export interface CreateRegistroEnvaseRequest {
  cantidadDeMaterialUsado: number;
  cantidadDeEnvasesProducidos: number;
  horasTrabajadas: number;
  fechaCreacion?: string;
  idOperario?: number;
  idUser: number;
  idProducto?: number;
  idMaterial?: number;
}

export interface RegistroEnvaseResponse {
  id: number;
  cantidadDeMaterialUsado: number;
  cantidadDeEnvasesProducidos: number;
  horasTrabajadas: number;
  fechaCreacion: string;
  idOperario?: number;
  idUser: number;
  idProducto?: number;
  idMaterial?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface ValidationErrors {
  cantidadMaterial?: boolean;
  cantidadEnvases?: boolean;
  horasTrabajadas?: boolean;
  descripcionFalla?: boolean;
}