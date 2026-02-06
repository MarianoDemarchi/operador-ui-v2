export interface Porcion {
  cabecera: string;
  ruta: string;
  convenio: string;
  porcion: string;
  estado: "ok" | "error" | "pending";
  update?: boolean;
}
