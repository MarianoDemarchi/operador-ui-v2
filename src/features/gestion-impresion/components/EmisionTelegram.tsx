import { useEffect, useState } from "react";
import { buildMensajeTelegram } from "../hooks/useEmisionTelegram";
import TelegramPhoneEditable from "./EmisionTelegramCel";
import type { Emision } from "../models/emision.model";
interface Props {
  fila?: Emision | null;
  onSendMessage: (mensaje: string) => void;
}
const EmisionTelegram: React.FC<Props> = ({ fila, onSendMessage }) => {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setMensaje(buildMensajeTelegram(fila));
  }, [fila]);

  if (!fila) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
      <TelegramPhoneEditable
        onSendMessage={onSendMessage}
        value={mensaje}
        onChange={setMensaje}
      />
    </div>
  );
};

export default EmisionTelegram;
