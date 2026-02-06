import { Drawer } from "antd";
import type { Emision } from "../models/emision.model";
import { EmisionInforme } from "./EmisionInforme";

interface Props {
  open: boolean;
  onClose: () => void;
  fila?: Emision | null;
}

export const EmisionDrawerInforme: React.FC<Props> = ({
  open,
  onClose,
}) => {
  return (
    <Drawer
      title="Enviar Informe"
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      maskClosable={false}
      mask={{ blur: false }}
    >
      <EmisionInforme
        onCancel={onClose}
      ></EmisionInforme>
    </Drawer>
  );
};
