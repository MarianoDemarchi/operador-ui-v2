import { Drawer } from "antd";
import type { Emision } from "../models/emision.model";
import EmisionDetalle from "./EmisionDetalle";

interface Props {
  open: boolean;
  onClose: () => void;
  fila?: Emision | null;
}

export const EmisionDrawerDetalle: React.FC<Props> = ({
  open,
  onClose,
  fila,
}) => {
  return (
    <Drawer
      title="Detalle Emision"
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      mask={{ blur: false }}

>
        <EmisionDetalle fila={fila}></EmisionDetalle>
    </Drawer>
  );
};
