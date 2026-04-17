import apiClients from "./client/client";

// src/api/modules/lotes.api.ts
export const LotesApi = {
  getAll: () =>
    apiClients.client.get("/operador-api/lotes", {
      params: { estado: "todos" },
      headers: {
        //   //  "x-action": "LISTAR_LOTES",
        //     //"x-permission": Permissions.LOTES_LISTAR,
      },
    }),
};
