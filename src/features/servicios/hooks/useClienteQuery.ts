// hooks/useClientesQuery.ts
import { useQuery } from "@tanstack/react-query";
import type { Cliente } from "../models/cliente.model";
import { ClientesApi } from "../../../api/clientes.api";

export const useClientesQuery = () =>
  useQuery<Cliente[]>({
    queryKey: ["clientes"],
    queryFn: async () => {
      const resp = await ClientesApi.getAll();
      return resp.data as Cliente[];
    },
    staleTime: 5 * 60 * 1000,
  });
