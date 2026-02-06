// hooks/useServiciosQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Servicio } from "../models/servicio.model";
import { ServiciosApi } from "../../../api/servicio.api";

export const useServiciosQuery = (base?: string) => {
  const queryClient = useQueryClient();


  // =========================
  // Query: obtener servicios
  // =========================
  const serviciosQuery = useQuery<Servicio[]>({
    queryKey: ["servicios", base],
    enabled: !!base,
    queryFn: async () => {
      const resp = await ServiciosApi.getByBase(base!);
      return resp.data as Servicio[];
    },
  });

  // =========================
  // Mutation: activar / desactivar
  // =========================
  const toggleServicioMutation = useMutation({
    mutationFn: (servicio: Servicio) =>
      ServiciosApi.toggle({
        id_servicio: servicio.id,
        activo: servicio.estado === 0 ? 1 : 0,
        base: base!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicios", base],
      });
    },
  });

  return {
    ...serviciosQuery, // data, isLoading, isError, refetch, etc
    toggleServicio: toggleServicioMutation.mutateAsync,
    toggling: toggleServicioMutation.isSuccess,
  };
};
