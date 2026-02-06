import type { PorcionesPayload } from "../features/gestion-impresion/models/porciones-add.models";
import ApiClient from "./client/client";

export const EmsionesPapel = {
  getAll: () =>
    ApiClient.client.get("/impresionesecoprod/lotes", {
      params: { estado: "creados" },
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),
  getArchivos: (distribuidora: string, servicio: string) =>
    ApiClient.client3.get(`/ListarArchivosPapel/${distribuidora}/${servicio}`, {
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),

  getCabeceras: () =>
    ApiClient.client.get(
      `operadorp/cabeceras
`,
    ),

  crear: (formData: FormData, servicio: string) =>
    ApiClient.client3.post(`/CrearLotePapel/${servicio}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  eliminar: (emision: number, proceso: string, id_archivolog: string) =>
    ApiClient.client.delete(
      `/impresionesecofrontprod/delete?id_emision=${emision}&proceso=${proceso}&id_archivo=${id_archivolog}`,
      {
        headers: {
          Accept: "application/json, text/plain, /",
        },
      },
    ),

  cancelar: (formData: FormData) =>
    ApiClient.client3.post("/CancelaLote", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  control: (cliente: string, id_lote: number) =>
    ApiClient.client.get(
      `/operadorp/control?cliente=${cliente}&lote=${id_lote}`,
    ),

  cargaPorciones: (payload: PorcionesPayload) =>
    ApiClient.client.post("/operadorp/porciones", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  enviarEmail: (cabecera: string, id_emision: number, convenio: string) =>
    ApiClient.client.get("/impresionesecoprod/impoperativos", {
      params: {
        cabecera: cabecera,
        emision: id_emision,
        convenio: convenio,
      },
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),
  enviarInforme: (distribuidora: string, fecha: string, informe: string) =>
    ApiClient.client.get("/impresionesecofrontprod/informes", {
      params: {
        distribuidora: distribuidora,
        fecha: fecha,
        informe: informe,
      },
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),

  enviarTelegram: (
    distribuidora: string,
    detalleMensaje: string,
    id_emision: number,
  ) =>
    ApiClient.client.get("/impresionesecoprod/telegram", {
      params: {
        distri: distribuidora,
        mensaje: detalleMensaje,
        emision: id_emision,
      },
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),
  movimientoArchivos: (formData: FormData) =>
    ApiClient.client3.post("/MovimientoEmision", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 0,
    }),
};
