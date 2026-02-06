import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actionFeedback } from "../../feedback/ActionFeedback";
import type { Tarea } from "../models/tarea.model";
import { TareaApi } from "../../../api/tareas.api";

const buildFormData = (tarea: Tarea | Tarea[]) => {
  const fd = new FormData();

  const payload = Array.isArray(tarea) ? tarea : tarea;

  fd.append("file", JSON.stringify(payload));
  return fd;
};


export const useTareaActions = () => {
  const queryClient = useQueryClient();

  const commonSuccess = () =>
    queryClient.invalidateQueries({ queryKey: ["lotes-legacy"] });


  const reenvio = useMutation({
    mutationFn: (reenvio: Tarea) =>
      TareaApi.reeenvio(buildFormData(reenvio)),
    onMutate: () => actionFeedback.loading("reenvio"),
    onSuccess: () => {
      actionFeedback.success("reenvio");
      commonSuccess();
    },
    onError: () => actionFeedback.error("reenvio"),
  });



  return {
    reenvio
  };
};
