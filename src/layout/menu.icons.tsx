import {
  DatabaseOutlined,
  FileTextOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

export const menuIconMap: Record<string, ReactNode> = {
  lotes: <DatabaseOutlined />,
  tareas: <ProfileOutlined />,
  reportes: <FileTextOutlined />,
  generacionPapel: <AppstoreOutlined />,
  servicios: <SettingOutlined />,
  portales: <AppstoreOutlined />,
};
