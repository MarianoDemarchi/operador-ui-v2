import { useQuery } from "@tanstack/react-query";
import type { LoteLegacy } from "../models/lote-legacy.model";
import { LotesLegacyApi } from "../../../api/lotes-legacy";


export const useLotesQuery = () =>
  useQuery<LoteLegacy[]>({
    queryKey: ["lotes-legacy"],
    queryFn: async () => {
      const resp = await LotesLegacyApi.getAll();
      return resp.data as LoteLegacy[];
    },
  });
