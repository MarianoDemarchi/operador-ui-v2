import type { Archivo } from "./archivo.model";

// models/lote.model.ts
export interface Lote {
  id_lote: number;
  nombre: string;
  servicio?: string;
  db?: string;
  l_nombre: string;
  estado: string;
  ts_enviado: string;
  mensajes: number;
  tandas?: number;
  entregados: number;
  rebotados: number;
  archivos?: Archivo[] | string;
}
