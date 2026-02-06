export interface ArchivoLoteLegacy {
  Nombre: string;
  Avance: number;
  "Tipo preproceso": string;
}

export interface LoteLegacy {
  id_lote: number;
  nombre: string;
  descripcion: string;
  base: string;
  estado: string;
  l_nombre: string;
  ts_enviado?: string;
  ts_preparado?: string;
  mensajes?: string;
  entregados?: string;
  rebotados?: string;
  tandas?: string;
  archivos?: string; // JSON string
}
