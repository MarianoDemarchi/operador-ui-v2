import apiClients from "./client/client";

// src/api/modules/lotes.api.ts
export const TareaApi = {
  getAll: () =>
    apiClients.client.get("/operadorp/lotes", {
      params: { estado: "acciones_v2" },
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),
  reeenvio: (formData: FormData) =>
    apiClients.client3.post("/Reenvio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
