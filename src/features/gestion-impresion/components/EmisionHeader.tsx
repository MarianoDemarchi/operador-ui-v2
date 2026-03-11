import { Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

export const EmisionHeader: React.FC<{
  onReload: () => void;
  isFetching: boolean;
}> = ({ onReload, isFetching }) => (
  <div style={{ marginBottom: 16 }}>
    <Title level={4}>
      Gestión de Documentos
      <Button
        type="text"
        icon={<ReloadOutlined spin={isFetching} />}
        onClick={onReload}
      />
    </Title>
    <Text type="secondary">
      Visualiza y administra las emisiones destinadas a impresión en papel.
      Permite generar documentos, subir archivos, enviar adjuntos por email,
      notificar informes vía Telegram y gestionar cargas por porciones.
    </Text>
  </div>
);
