import apiClients from "./client/client";

export const LogsApi = {
  getAll: (timelog?: string) =>
    apiClients.client.get("/operadorp/logs", {
      params: {
        timelog: timelog ?? "", // 👈 FORZADO

        estado: "todos",
      },
    }),
};
