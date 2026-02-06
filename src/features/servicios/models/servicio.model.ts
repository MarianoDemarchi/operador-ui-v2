// models/servicio.model.ts
export interface Servicio {
  id: number;
  nombre: string;
  estado: number; // 0 = activo, 1 = inactivo
}
