import apiClients from "./client/client";

export const LegacyFilesApi = {
  getAll: () => apiClients.client3.get("/ListarArchivos", {}),
  getAllUpload: () => apiClients.client3.get("/ListarArchivosDescarga", {}),
};
