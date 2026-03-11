import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { LogsApi } from "../../../api/logs.api";
import type { LogLote } from "../models/log.model";

export const useLogsQuery = (openLogs: boolean) => {
  const lastTimeLogRef = useRef<string | undefined>(undefined);

  const query = useQuery<LogLote[]>({
    queryKey: ["logs"],
    queryFn: async () => {
      const resp = await LogsApi.getAll(lastTimeLogRef.current);
      const data = resp.data as LogLote[];

      // 👉 actualizamos el timestamp SOLO si llegaron datos
      if (data.length > 0) {
        lastTimeLogRef.current = data[data.length - 1].ts_log;
      }

      return data;
    },
    refetchInterval: openLogs ? 300000 : false,
    enabled: openLogs,
  });

  return {
    ...query,
    logs: query.data ?? [],
  };
};
