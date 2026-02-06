import { Button, Space } from "antd";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";

export const EmisionHeader: React.FC<{
  onReload: () => void;
  isFetching: boolean;
}> = ({ onReload, isFetching }) => (
  <Space style={{ marginBottom: 16 }}>
    <Title level={4}>
      Gestion de Envios{" "}
      <Button
        type="text"
        icon={<ReloadOutlined spin={isFetching} />}
        onClick={onReload}
      />
    </Title>
  </Space>
);
