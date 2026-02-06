export interface CabeceraDetalle {
  cabecera: string;
  id_cabecera: string;
  comprobantes: number;
  total_pag_pdf: number;
  imprime_CO: "si" | "no";
  ok_para_subir: "si" | "no";

  ok_upload_lci?: {
    resultado: string; // "0" = ok
  };

  ok_upload?: {
    resultado: string; // "0" = ok
  };

  sube_rot_rem?: {
    resultado: string; // "0" = ok
  };

  envia_co_imprime?: any | null;
}
export interface EmisionRow {
  id_emision: number;
  servicio: string;
  distribuidora: string;
  fecha: string;
  comprobantes: number;
  estado: 
    | "Archivos Subidos"
    | "Ok para subir"
    | "Aguarde"
    | string;

  centroOperativo?: 1 | 2 | 3 | number;
  envia_telegram?: any | null;

  // viene como string JSON
  cabeceras?: string;
}
