import { Layout, Space } from "antd";

const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header
      style={{
        background: "#001529",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
 

      <Space>{/* Futuro: usuario, logout, notificaciones */}</Space>
    </Header>
  );
};

export default HeaderBar;
