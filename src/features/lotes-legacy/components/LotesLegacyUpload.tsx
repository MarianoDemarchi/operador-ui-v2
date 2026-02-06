import { Drawer } from "antd";
import { LoteCargarForm } from "./LotesLegacyCargarFomulario";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LotesLegacyUpload: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer
      title="Cargar archivo auxiliar"
      open={open}
      onClose={onClose}
      width={720}
      mask={{ blur: false }}
      maskClosable={false}
    >
      <LoteCargarForm onCancel={onClose} />
    </Drawer>
  );
};
