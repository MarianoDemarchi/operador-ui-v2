import { message } from "antd";

type ActionType =
  | "enviar"
  | "cancelar"
  | "detener"
  | "sumarizar"
  | "listar"
  | "crear"
  | "actualizar"
  | "reenvio"
  | "control"
  | "enviarTelegram"
  | "movimiento"
  | "validar"
  | "informe";

const labels: Record<ActionType, string> = {
  enviar: "Enviando lote",
  cancelar: "Cancelando lote",
  detener: "Deteniendo lote",
  sumarizar: "Sumarizando lote",
  listar: "Listando lotes",
  actualizar: "Actualizando lotes",
  crear: "Creando Lote",
  reenvio: "Generando Reenvio",
  control: "Generando archivo de control",
  enviarTelegram: "Enviando Telegram",
  movimiento: "Subiendo Archivos",
  validar: "Validar Porciones",
  informe: "Enviar informe",
};

export const actionFeedback = {
  loading(action: ActionType) {
    message.loading({
      content: `${labels[action]}…`,
      key: action,
    });
  },

  success(action: ActionType, msg?: string) {
    message.success({
      content: msg ?? `${labels[action]} completado correctamente`,
      key: action,
    });
  },

  error(action: ActionType, msg?: string) {
    message.error({
      content: msg ?? `Error al ${labels[action].toLowerCase()}`,
      key: action,
    });
  },
};
