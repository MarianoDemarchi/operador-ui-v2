import apiClients from "./client/client";

// src/api/modules/lotes.api.ts
export const MonitoreoApi = {
  getAll: () =>
    apiClients.client4.get(
      `https://wempsb1a8j.execute-api.us-east-1.amazonaws.com/prod/lotes`,
      {},
    ),
};
