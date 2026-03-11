import { Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

interface Props {
  onSearch: (value: string) => void;
  onRefresh: () => void;
}

export const LogLotesSearch: React.FC<Props> = ({ onSearch, onRefresh }) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Buscar..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: 300 }}
        prefix={<SearchOutlined />}
      />
      <Button onClick={onRefresh} icon={<ReloadOutlined />} />
    </Space>
  );
};
