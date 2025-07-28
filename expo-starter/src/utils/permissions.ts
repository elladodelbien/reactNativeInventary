/**
 * Utilidades para manejo de permisos basados en roles de usuario
 * Basado en los permisos definidos en el backend
 */

export type UserRole = 
  | "Operario de Planta"
  | "Supervisor de Área" 
  | "Gerente de Producción"
  | "Administrativo";

export interface User {
  id: number;
  email: string;
  nombre: string;
  cargo: UserRole;
  telefono: string;
  activo: boolean;
}

/**
 * Verifica si el usuario puede ver todos los registros de envases
 * Permisos: Supervisor de Área, Gerente de Producción, Administrativo
 */
export const canViewAllRecords = (user: User | null): boolean => {
  if (!user?.cargo) return false;
  
  const authorizedRoles: UserRole[] = [
    "Supervisor de Área",
    "Gerente de Producción", 
    "Administrativo"
  ];
  
  return authorizedRoles.includes(user.cargo);
};

/**
 * Verifica si el usuario puede crear registros de envases
 * Permisos: Operario de Planta, Supervisor de Área, Gerente de Producción
 */
export const canCreateRecords = (user: User | null): boolean => {
  if (!user?.cargo) return false;
  
  const authorizedRoles: UserRole[] = [
    "Operario de Planta",
    "Supervisor de Área",
    "Gerente de Producción"
  ];
  
  return authorizedRoles.includes(user.cargo);
};

/**
 * Verifica si el usuario puede ver registros específicos por ID
 * Permisos: Todos los roles autenticados
 */
export const canViewRecordById = (user: User | null): boolean => {
  return !!user?.cargo;
};

/**
 * Verifica si el usuario puede acceder a reportes
 * Permisos: Supervisor de Área, Gerente de Producción, Administrativo
 */
export const canAccessReports = (user: User | null): boolean => {
  if (!user?.cargo) return false;
  
  const authorizedRoles: UserRole[] = [
    "Supervisor de Área",
    "Gerente de Producción", 
    "Administrativo"
  ];
  
  return authorizedRoles.includes(user.cargo);
};

/**
 * Verifica si el usuario es administrador (máximos permisos)
 * Permisos: Gerente de Producción, Administrativo
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user?.cargo) return false;
  
  const adminRoles: UserRole[] = [
    "Gerente de Producción", 
    "Administrativo"
  ];
  
  return adminRoles.includes(user.cargo);
};

/**
 * Obtiene una descripción legible de los permisos del usuario
 */
export const getUserPermissionsDescription = (user: User | null): string => {
  if (!user?.cargo) return "Sin permisos";
  
  switch (user.cargo) {
    case "Operario de Planta":
      return "Puede crear registros y ver sus propios registros";
    case "Supervisor de Área":
      return "Puede crear y ver todos los registros, acceder a reportes";
    case "Gerente de Producción":
      return "Acceso completo a registros, reportes y administración";
    case "Administrativo":
      return "Acceso completo a reportes y visualización de datos";
    default:
      return "Permisos no definidos";
  }
};