import { Drawer } from "antd";
import { EmisionFormCrear } from "./EmisionFormCrear";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const EmisionDrawerCreate: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer
      title="Crear nueva emision"
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      maskClosable={false}
      mask={{ blur: false }}
    >
      <EmisionFormCrear onCancel={onClose} />
    </Drawer>
  );
};
