import apiClients from "./client/client";

// api/servicios.api.ts

export const ServiciosApi = {
  getByBase: (base: string) =>
    // apiClients.client2.get("/operadord-v2/servicios", {
    apiClients.client.get("/operadorp/servicios", {
      params: { base },
    }),

  toggle: (payload: { id_servicio: number; activo: number; base: string }) =>
    apiClients.client2.put(
      `operadord-v2/gestion-servicios` +
        `?id_servicio=${payload.id_servicio}` +
        `&db=${payload.base}` +
        `&activo=${payload.activo}`,
    ),
};
