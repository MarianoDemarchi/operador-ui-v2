// hooks/useLegacyFiles.ts
import { useQuery } from "@tanstack/react-query";
import { LegacyFilesApi } from "../../../api/legacy-files.api";
import type { LegacyFilesResponse } from "../models/lotes-legacy-files.model";

export const useLegacyFiles = () =>
  useQuery<LegacyFilesResponse>({
    queryKey: ["legacy-files"],
    queryFn: async () => {
      const resp = await LegacyFilesApi.getAll();
      return resp.data;
    },
    enabled: true,
  });
