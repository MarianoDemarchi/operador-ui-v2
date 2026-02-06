import { Button, Space } from "antd";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";

export const LotesHeader: React.FC<{ onReload: () => void }> = ({
  onReload,
}) => (
  <Space style={{ marginBottom: 16 }}>
    <Title level={4}>
      Lotes Creados V2{" "}
      <Button type="text" icon={<ReloadOutlined />} onClick={onReload} />
    </Title>
  </Space>
);
