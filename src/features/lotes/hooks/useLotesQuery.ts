import { useQuery } from "@tanstack/react-query";
import { LotesApi } from "../../../api/lotes.api";
import type { Lote } from "../models/lote.model";


export const useLotesQuery = () =>
  useQuery<Lote[]>({
    queryKey: ["lotes"],
    queryFn: async () => {
      const resp = await LotesApi.getAll();
      return resp.data as Lote[];
    },
  });
