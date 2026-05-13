// hooks/useServiciosQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Servicio } from "../models/servicio.model";
import { ServiciosApiGestion } from "../../../api/servicio.api";
import { message } from "antd";

export const useServiciosQueryGestion = (base?: string) => {
  const queryClient = useQueryClient();

  // =========================
  // Query: obtener servicios
  // =========================
  const serviciosQuery = useQuery<Servicio[]>({
    queryKey: ["servicios", base],
    enabled: !!base,
    queryFn: async () => {
      const resp = await ServiciosApiGestion.getByBase(base!);
      return resp.data as Servicio[];
    },
  });

  // =========================
  // Mutation: activar / desactivar
  // =========================
  const toggleServicioMutation = useMutation({
    mutationFn: (servicio: Servicio) =>
      ServiciosApiGestion.toggle({
        id_servicio: servicio.id,
        activo: servicio.estado === 1 ? 0 : 1,
        base: base!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicios", base],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error al actualizar el servicio",
      );
    },
  });

  return {
    ...serviciosQuery, // data, isLoading, isError, refetch, etc
    toggleServicio: toggleServicioMutation.mutateAsync,
    toggling: toggleServicioMutation.isSuccess,
  };
};
