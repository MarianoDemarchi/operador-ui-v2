import apiClients from "./client/client";

export const ClientesApi = {
  getAll: () =>
    apiClients.client.get("/operador-api/clientes"),
};