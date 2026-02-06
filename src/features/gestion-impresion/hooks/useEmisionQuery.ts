import { useQuery } from "@tanstack/react-query";
import { EmsionesPapel } from "../../../api/emisiones-papel";
import type { Cabecera } from "../models/cabecera.model";
import type { Emision } from "../models/emision.model";
function calcularCentroOperativo(cabeceras: Cabecera[]): number {
  const flags: number[] = [];

  cabeceras.forEach((c) => {
    if (c.imprime_CO === "si") {
      flags.push(1);
      flags.push(c.envia_co_imprime !== undefined ? 2 : 3);
    } else {
      flags.push(0);
    }
  });

  if (flags.includes(1) && flags.includes(2) && !flags.includes(3)) return 1;
  if (flags.includes(1) && flags.includes(3)) return 2;
  if (flags.includes(0)) return 3;
  return 4;
}

function calcularEstado(cabeceras: Cabecera[]): Emision["estado"] {
  const estados: number[] = [];

  cabeceras.forEach((c) => {
    if (c.ok_upload?.resultado === "0" && c.ok_upload_lci?.resultado === "0") {
      estados.push(2);
    } else if (c.ok_upload_lci?.resultado === "0") {
      estados.push(1);
    } else if (c.ok_upload_lci?.resultado === undefined) {
      estados.push(10);
    } else if (c.ok_para_subir === "si") {
      estados.push(4);
    } else {
      estados.push(0);
    }
  });

  if (estados.includes(2) && !estados.includes(1)) return "Archivos Subidos";
  if (estados.includes(1) && !estados.includes(10)) return "Ok para subir";
  if (estados.includes(4)) return "Validacion Correcta";
  if (estados.includes(10)) return "Aguarde";
  return "Controlar Emision";
}

export function useEmisionesQuery() {
  return useQuery<Emision[], Error, Emision[]>({
    queryKey: ["emisiones"],
    queryFn: async () => {
      const resp = await EmsionesPapel.getAll();
      return resp.data as Emision[];
    },
    select: (data) =>
      data.map((e) => {
        const cabeceras: Cabecera[] = JSON.parse(e.cabeceras ?? "[]");

        return {
          id_emision: e.id_emision,
          servicio: e.servicio,
          distribuidora: e.distribuidora,
          fecha: e.fecha,
          comprobantes: e.comprobantes,
          envia_telegram: e.envia_telegram,
          proceso: e.proceso,
          id_archivolog: e.id_archivolog,
          cabeceras,
          centroOperativo: calcularCentroOperativo(cabeceras),
          estado: calcularEstado(cabeceras),
        };
      }),
  });
}
