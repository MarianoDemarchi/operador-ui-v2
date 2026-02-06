// models/lote.model.ts


export interface Tarea {
  id_lote: string;
  nombre: string;
  descripcion: string;
  l_nombre: string;
  ts_enviado: string;
  accion_pendiente: string;
  detalle: string;
  tiempo_excedido: string;
  tipo_tarea: "reenvio" | "reporte" | string;
}


export interface TareasAccionesProps {
  data: Tarea[];
  handleClickRefresh: () => void;
  handelClickReenvio: () => void;
  handleClickGenerarInformes: () => void;
}
