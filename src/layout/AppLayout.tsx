import React, {  Suspense } from "react";
import { Layout, Button, Spin } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import { useUI } from "../context/UIContext";
import "../table_transicion.css";
import LogsLotes from "../features/logs/pages/LogsLotes";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const { toggleLogs, showLogs } = useUI();

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sidebar />

      <Layout style={{ display: "flex", flexDirection: "column" }}>
        <HeaderBar />

        <Content
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            position: "relative",
          }}
        >
          {/* IMPORTANTE: El Suspense aquí asegura que si ListaLotesV2 es lazy, 
              tenga un fallback inmediato al refrescar.
          */}
          <Suspense>
            <Outlet />
          </Suspense>
        </Content>

        <Button
          type="primary"
          style={{
            position: "fixed",
            bottom: showLogs ? 366 : 16, // Sube el botón cuando se ven los logs
            right: 16,
            zIndex: 1100,
            transition: "bottom 500ms ease-in-out",
          }}
          onClick={toggleLogs}
        >
          {showLogs ? "Ocultar Logs" : "Ver Logs"}
        </Button>

        {/* Panel de logs con Background Diferenciado */}
        <div
          className="panel-actividad"
          style={{
            position: "fixed",
            left: 0, // Si el Sidebar es fijo, ajusta este valor al ancho del sider
            right: 0,
            bottom: 0,
            height: 350,
            backgroundColor: "#ffffff", // Fondo estilo terminal/oscuro
            color: "#fff",
            transform: showLogs ? "translateY(0%)" : "translateY(100%)",
            transition: "transform 500ms ease-in-out",
            zIndex: 1050,
            boxShadow: "0 -4px 12px rgb(201, 201, 201)",
          }}
        >
          <div style={{ height: "100%", overflow: "auto" }}>
            <Suspense
              fallback={
                <Spin style={{ margin: "20px auto", display: "block" }} />
              }
            >
              <LogsLotes openLogs={showLogs} />
            </Suspense>
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
