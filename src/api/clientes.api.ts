import apiClients from "./client/client";

export const ClientesApi = {
  getAll: () =>
    apiClients.client2.get("/operadord-v2/clientes"),
};