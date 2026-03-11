import { Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const TareaHeader: React.FC<{ onReload: () => void }> = ({
  onReload,
}) => (
  <div style={{ marginTop: 20 , marginBottom:10 }}>
    <Title level={4} style={{ margin: 0 }}>
      Acciones Pendientes
      <Button type="text" icon={<ReloadOutlined />} onClick={onReload} />
    </Title>

    <Text type="secondary">
      Acciones pendientes que requieren intervención del operador.
    </Text>
  </div>
);
