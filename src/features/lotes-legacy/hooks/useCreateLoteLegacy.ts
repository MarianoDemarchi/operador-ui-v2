import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LotesLegacyApi } from "../../../api/lotes-legacy";
import { actionFeedback } from "../../feedback/ActionFeedback";
import type { CrearLotePayload } from "../models/lote-legacy-crear.model";

const buildFormData = (payload: CrearLotePayload) => {
  const fd = new FormData();
  fd.append("file", JSON.stringify(payload));
  return fd;
};

export const useCreateLoteLegacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CrearLotePayload) =>
      LotesLegacyApi.crear(buildFormData(payload)),

    onMutate: () => actionFeedback.loading("crear"),

    onSuccess: () => {
      actionFeedback.success("crear");
      queryClient.invalidateQueries({ queryKey: ["lotes-legacy"] });
    },

    onError: () => actionFeedback.error("crear"),
  });
};
