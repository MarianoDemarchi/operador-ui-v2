
export interface Emision {
  id_emision: number;
  servicio: string;
  id_archivolog: string;
  proceso: string;
  distribuidora: string;
  fecha: string;
  comprobantes: number;
  estado: "Archivos Subidos" | "Ok para subir" | "Aguarde" | string;

  centroOperativo?: 1 | 2 | 3 | number;
  envia_telegram?: any | null;

  cabeceras: any; // ✅ CAMBIO CLAVE
}
