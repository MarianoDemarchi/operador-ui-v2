import { Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const LotesLegacyHeader: React.FC<{
  onReload: () => void;
  isFetching: boolean;
}> = ({ onReload, isFetching }) => (
  <div style={{ marginBottom: 15 }}>
    <Title level={4}>
      Gestión de Envíos Digitales
      <Button
        type="text"
        icon={<ReloadOutlined spin={isFetching} />}
        onClick={onReload}
      />
    </Title>

    <Text type="secondary">
      Crea y administra envíos, valida datos de clientes mediante archivos
      muestrero, carga archivos comunes y actualiza métricas de envío.
    </Text>
  </div>
);
