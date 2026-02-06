import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actionFeedback } from "../../feedback/ActionFeedback";
import type { Emision } from "../models/emision.model";
import { EmsionesPapel } from "../../../api/emisiones-papel";
import type { Cabecera } from "../models/cabecera.model";
import type { PorcionesPayload } from "../models/porciones-add.models";

interface EnviarEmailPayload {
  emision: Emision;
  cabecera: Cabecera;
}

interface EnviarInformePayload {
  distribuidora: string;
  fecha: string;
  informe: string;
}

interface EnviarTelegramPayload {
  distribuidora: string;
  mensaje: string;
  id_emision: number;
}

export interface MovimientoEmisionPayload {
  fila: Emision[];
  cabeceras: Cabecera[];
  cabecerasExternas: Cabecera[];
}

const buildMovimientoPayload = (emision: Emision): FormData => {
  const cabecerasLocal: Cabecera[] = [];
  const cabecerasExternas: Cabecera[] = [];

  emision.cabeceras.forEach((c: Cabecera) => {
    if (c.ok_para_subir === "si") {
      if (c.imprime_CO === "no") {
        cabecerasLocal.push(c);
      } else if (c.imprime_CO === "si") {
        cabecerasExternas.push(c);
      }
    }
  });

  const payload = [
    {
      fila: [emision], // ✅ una sola fila
      cabeceras: cabecerasLocal,
      cabecerasExternas,
    },
  ];

  const fd = new FormData();
  fd.append("file", JSON.stringify(payload));
  return fd;
};

const buildFormData = (emision: Emision) => {
  const fd = new FormData();
  fd.append("file", JSON.stringify(emision));
  return fd;
};

export const useEmisionActions = () => {
  const queryClient = useQueryClient();

  const commonSuccess = () =>
    queryClient.invalidateQueries({ queryKey: ["emisiones"] });

  const crear = useMutation({
    mutationFn: async (emision: Emision) => {
      const resp = await EmsionesPapel.crear(
        buildFormData(emision),
        emision.servicio,
      );

      // ❌ Error lógico aunque sea 200
      if (resp.data?.type) {
        throw new Error(resp.data.message ?? "Error al crear emisión");
      }

      // ❌ Respuesta inesperada
      if (resp.data?.mensaje !== "Envio Correcto") {
        throw new Error("Respuesta inválida del servidor");
      }

      // ✅ Éxito real
      return resp.data;
    },

    onMutate: () => actionFeedback.loading("crear"),

    onSuccess: () => {
      actionFeedback.success("crear");
      commonSuccess();
    },

    onError: (error: any) => {
      actionFeedback.error("crear");
      console.error("Error crear emisión:", error.message);
    },
  });

  const eliminar = useMutation({
    mutationFn: (emision: Emision) =>
      EmsionesPapel.eliminar(
        emision.id_emision,
        emision.proceso,
        emision.id_archivolog,
      ),

    onMutate: () => actionFeedback.loading("cancelar"),
    onSuccess: () => {
      actionFeedback.success("cancelar");
      commonSuccess();
    },
    onError: () => actionFeedback.error("cancelar"),
  });

  const movimientoArchivos = useMutation({
    mutationFn: (emision: Emision) =>
      EmsionesPapel.movimientoArchivos(buildMovimientoPayload(emision)),
    onMutate: () => actionFeedback.loading("movimiento"),

    onSuccess: (res) => {
      if (res.data?.statusCode === 200) {
        actionFeedback.success("movimiento");
        commonSuccess();
      } else {
        actionFeedback.error(res.data?.mensaje ?? "Error en backend");
      }
    },

    onError: () => actionFeedback.error("movimiento"),
  });

  const enviarEmail = useMutation({
    mutationFn: ({ emision, cabecera }: EnviarEmailPayload) =>
      EmsionesPapel.enviarEmail(
        cabecera.id_cabecera,
        emision.id_emision,

        cabecera?.id_cabecera?.at(-1) ?? "",
      ),

    onMutate: () => actionFeedback.loading("enviar"),

    onSuccess: () => {
      actionFeedback.success("enviar");
      commonSuccess();
    },

    onError: () => actionFeedback.error("enviar"),
  });

  const enviarInforme = useMutation({
    mutationFn: ({ distribuidora, fecha, informe }: EnviarInformePayload) =>
      EmsionesPapel.enviarInforme(distribuidora, fecha, informe),

    onMutate: () => actionFeedback.loading("informe"),

    onSuccess: (res) => {
      if (res.data?.status === 500) {
        throw new Error();
      } else {
        actionFeedback.success("informe");
      }
    },

    onError: () => actionFeedback.error("informe"),
  });

  const enviarTelegram = useMutation({
    mutationFn: ({
      distribuidora,
      mensaje,
      id_emision,
    }: EnviarTelegramPayload) =>
      EmsionesPapel.enviarTelegram(distribuidora, mensaje, id_emision),

    onMutate: () => actionFeedback.loading("enviar"),

    onSuccess: () => {
      actionFeedback.success("enviar");
      commonSuccess();
    },

    onError: () => actionFeedback.error("enviar"),
  });

  const validarPorciones = useMutation({
    mutationFn: async (payload: PorcionesPayload) => {
      const res = await EmsionesPapel.cargaPorciones(payload);
      const body = JSON.parse(res.data.body);
      return body.resultado.porciones;
    },

    onSuccess: () => {
      actionFeedback.success("validar");
    },

    onError: () => actionFeedback.error("validar"),
  });

  return {
    crear,
    eliminar,
    movimientoArchivos,
    enviarEmail,
    enviarTelegram,
    validarPorciones,
    enviarInforme,
  };
};
