import { Drawer } from "antd";
import { LoteForm } from "./LotesLegacyCrearFormulario";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LotesLegacyCrear: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer
      title="Crear nuevo lote"
      open={open}
      onClose={onClose}
      width={720}
      maskClosable={false}
      mask={{ blur: false }}
    >
      <LoteForm onCancel={onClose} />
    </Drawer>
  );
};
