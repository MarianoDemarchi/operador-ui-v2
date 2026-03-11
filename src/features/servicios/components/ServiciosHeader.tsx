import { Typography } from "antd";

const { Title, Text } = Typography;
export const ServiciosHeader: React.FC<{}> = () => (
  <div style={{ marginBottom: 16 }}>
    <Title level={4}>Panel de Servicios Automatizados </Title>
    <Text type="secondary">
      Controla la ejecución de servicios automatizados y permite detenerlos ante
      posibles inconsistencias en los envíos.
    </Text>
  </div>
);
