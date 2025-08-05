export interface CreateRegistroEnvaseRequest {
  cantidadDeMaterialUsado: number;
  cantidadDeEnvasesProducidos: number;
  horasTrabajadas: number;
  fechaCreacion?: string;
  idOperario: number; // Campo requerido según backend
  idUser: number;
  idProducto: number; // Campo requerido según backend
  idMaterial: number; // Campo requerido según backend
}

export interface RegistroEnvaseResponse {
  id: number;
  cantidadDeMaterialUsado: number;
  cantidadDeEnvasesProducidos: number;
  horasTrabajadas: number;
  fechaCreacion: string;
  idOperario: number;
  idUser: number;
  idProducto: number;
  idMaterial: number;
  createdAt: string;
  updatedAt: string;
  
  // Información completa de relaciones
  usuario: {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    activo: boolean;
  };
  
  operario: {
    id: number;
    areaDeTrabajo: string;
  };
  
  producto: {
    id: number;
    nombre: string;
    capacidad: string;
    color: string;
  };
  
  material: {
    id: number;
    nombre: string;
    color: string;
  };
}

// Nueva interface para la respuesta paginada
export interface RegistrosEnvasesResponse {
  data: RegistroEnvaseResponse[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Interface para parámetros de query
export interface RegistrosEnvasesQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'id' | 'fechaCreacion' | 'cantidadDeEnvasesProducidos' | 'horasTrabajadas';
  sortOrder?: 'ASC' | 'DESC';
  userId?: number;
  operarioId?: number;
  productoId?: number;
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
