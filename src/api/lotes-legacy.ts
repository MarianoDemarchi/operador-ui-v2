import ApiClient from "./client/client";

export const LotesLegacyApi = {
  getAll: () =>
    ApiClient.client.get("/operadorp/lotes", {
      params: { estado: "todos" },
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),
  getCamposDinamicos: (servicioId: number, base: string) =>
    ApiClient.client.get(
      `/operadorp/campos?base=${base}&servicio=${servicioId}`,
    ),

  crear: (formData: FormData) =>
    ApiClient.client3.post("/CrearLote", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  enviar: (formData: FormData) =>
    ApiClient.client3.post("/EnvioLote", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  cancelar: (formData: FormData) =>
    ApiClient.client3.post("/CancelaLote", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  control: (cliente: string, id_lote: number) =>
    ApiClient.client.get(
      `/operadorp/control?cliente=${cliente}&lote=${id_lote}`,
    ),

  detener: (formData: FormData) =>
    ApiClient.client3.post("/DetenerLote", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sumarizar: (base: string, idLote: number) =>
    ApiClient.client.get("/operadorp/sumariza", {
      params: {
        base,
        lote: idLote,
      },
    }),
};
