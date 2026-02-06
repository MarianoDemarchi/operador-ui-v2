import { Layout, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { sidebarItems } from "./menu.data";
import { mapMenuToAntdItems } from "./menu.mapper";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
    style={{background:" #001529"}}
      width={200}
      collapsible
      collapsed={collapsed}
      trigger={null} // desactiva el trigger por defecto
    >
      {/* Header / Trigger personalizado */}
      <div
        style={{
          height: 48,
          margin: 16,
          background: "rgba(255, 255, 255, .2)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "0 12px",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {!collapsed && <span>Mando Operador</span>}
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={mapMenuToAntdItems(sidebarItems)}
      />
    </Sider>
  );
};

export default Sidebar;
