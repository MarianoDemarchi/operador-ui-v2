// hooks/useLegacyFiles.ts
import { useQuery } from "@tanstack/react-query";
import { LegacyFilesApi } from "../../../api/legacy-files.api";
import type { LegacyFilesResponseUpload } from "../models/lotes-legacy-files-upload.model";

export const useLegacyFilesUpload = () =>
  useQuery<LegacyFilesResponseUpload>({
    queryKey: ["legacy-files-upload"],
    queryFn: async () => {
      const resp = await LegacyFilesApi.getAllUpload();
      return resp.data;
    },
    enabled: true,
  });
