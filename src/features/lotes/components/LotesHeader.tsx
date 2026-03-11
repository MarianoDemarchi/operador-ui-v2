import { Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
export const LotesHeader: React.FC<{ onReload: () => void }> = ({
  onReload,
}) => (
  <div style={{ marginBottom: 16 }}>
    <Title level={4}>
      Gestión de Envíos Digitales{" "}
      <Button type="text" icon={<ReloadOutlined />} onClick={onReload} />
    </Title>
    <Text type="secondary">
      Visualiza el estado, el progreso y los resultados de los envíos.
    </Text>
  </div>
);
