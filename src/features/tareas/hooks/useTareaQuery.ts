import { useQuery } from "@tanstack/react-query";
import { TareaApi } from "../../../api/tareas.api";
import type { Tarea } from "../models/tarea.model";

export const useTareaQuery = () =>
  useQuery<Tarea[]>({
    queryKey: ["tarea"],
    queryFn: async () => {
      const resp = await TareaApi.getAll();
      return resp.data as Tarea[];
    },
  });
