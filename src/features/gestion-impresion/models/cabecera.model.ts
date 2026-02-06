export interface Cabecera {
  cabecera: [];
  id_cabecera: string;
  comprobantes: number;
  total_pag_pdf: number;
  ok_para_subir?: "si" | "no";
  imprime_CO?: "si" | "no";
  envia_co_imprime?: { resultado?: 0 | 1 };
  ok_upload?: {
    resultado?: "0" | "1";
  };
  ok_upload_lci?: {
    resultado?: "0" | "1";
  };
  sube_rot_rem?: {
    resultado?: "0" | "1";
  };
}
