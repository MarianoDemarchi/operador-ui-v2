import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LotesLegacyApi } from "../../../api/lotes-legacy";
import type { LoteLegacy } from "../models/lote-legacy.model";
import { actionFeedback } from "../../feedback/ActionFeedback";

const buildFormData = (lote: LoteLegacy | LoteLegacy[]) => {
  const fd = new FormData();

  const payload = Array.isArray(lote) ? lote : [lote];

  fd.append("file", JSON.stringify(payload));
  return fd;
};


export const useLotesLegacyActions = () => {
  const queryClient = useQueryClient();

  const commonSuccess = () =>
    queryClient.invalidateQueries({ queryKey: ["lotes-legacy"] });

  const enviar = useMutation({
    mutationFn: (lote: LoteLegacy) =>
      LotesLegacyApi.enviar(buildFormData(lote)),
    onMutate: () => actionFeedback.loading("enviar"),
    onSuccess: () => {
      actionFeedback.success("enviar");
      commonSuccess();
    },
    onError: () => actionFeedback.error("enviar"),
  });

  const cancelar = useMutation({
    mutationFn: (lote: LoteLegacy) =>
      LotesLegacyApi.cancelar(buildFormData(lote)),
    onMutate: () => actionFeedback.loading("cancelar"),
    onSuccess: () => {
      actionFeedback.success("cancelar");
      commonSuccess();
    },
    onError: () => actionFeedback.error("cancelar"),
  });

  const detener = useMutation({
    mutationFn: (lote: LoteLegacy) =>
      LotesLegacyApi.detener(buildFormData(lote)),
    onMutate: () => actionFeedback.loading("detener"),
    onSuccess: () => {
      actionFeedback.success("detener");
      commonSuccess();
    },
    onError: () => actionFeedback.error("detener"),
  });

  const sumarizar = useMutation({
    mutationFn: (lote: LoteLegacy) =>
      LotesLegacyApi.sumarizar(lote.base, lote.id_lote),
    onMutate: () => actionFeedback.loading("sumarizar"),
    onSuccess: () => {
      actionFeedback.success("sumarizar");
      commonSuccess();
    },
    onError: () => actionFeedback.error("sumarizar"),
  });

  const control = useMutation({
    mutationFn: (lote: LoteLegacy) =>
      LotesLegacyApi.control(lote.base, lote.id_lote),
    onMutate: () => actionFeedback.loading("control"),
    onSuccess: () => {
      actionFeedback.success("control");
      commonSuccess();
    },
    onError: () => actionFeedback.error("control"),
  });
  

  return {
    enviar,
    cancelar,
    detener,
    sumarizar,
    control
  };
};
