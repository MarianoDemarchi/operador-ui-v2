export interface CrearLotePayload {
//  version: string;
  etiquetas: Record<string, string>;
  diaEtiqueta: string;
  mascara: string;
  recepcion: string;
  id_servicio: number;
  base: string;
  id_cliente: number;
  cod_cliente: string;
  cod_servicio: string;
  archiv: File[];
  archivoAdjunto?: File[];
  canal?: string;
  nombre?: string;
}


