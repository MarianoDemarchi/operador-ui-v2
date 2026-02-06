import { Drawer } from "antd";
import EmisionTelegram from "./EmisionTelegram";
import type { Emision } from "../models/emision.model";

interface Props {
  open: boolean;
  onClose: () => void;
  fila?: Emision | null;
  onSendMessage: (mensaje: string) => void;
}

export const EmisionDrawerTelegram: React.FC<Props> = ({
  open,
  onClose,
  fila,
  onSendMessage,
}) => {
  return (
    <Drawer
      title="Envia Telegram"
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      maskClosable={false}
            mask={{blur:false}}

    >
      {" "}
      <EmisionTelegram
        onSendMessage={onSendMessage}
        fila={fila}
      ></EmisionTelegram>
    </Drawer>
  );
};
