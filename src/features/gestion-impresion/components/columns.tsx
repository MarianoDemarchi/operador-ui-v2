import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  CloudUploadOutlined,
  MailOutlined,
  SyncOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import type { Emision } from "../models/emision.model";
import type { ColumnsType } from "antd/es/table";
import { Tooltip } from "antd";
export const emisionColumns: ColumnsType<Emision> = [
  { title: "ID", dataIndex: "id_emision" },
  { title: "Servicio", dataIndex: "servicio" },
  { title: "Distribuidora", dataIndex: "distribuidora" },
  {
    title: "Fecha",
    dataIndex: "fecha",
    render: (v: string) => v.replace(/\s+/g, ""),
  },
  { title: "Comprobantes", dataIndex: "comprobantes", align: "center" },
  {
    title: "Estado",
    align: "center",
    render: (_, r) => {
      switch (r.estado) {
        case "Ok para subir":
          return (
            <CheckCircleTwoTone style={{ color: "#52c41a", fontSize: 17 }} />
          );

        case "Archivos Subidos":
          return (
            <CloudUploadOutlined style={{ color: "#52c41a", fontSize: 17 }} />
          );
        case "Validacion Correcta":
          return (
            <CloudUploadOutlined style={{ color: "#52c41a", fontSize: 17 }} />
          );

        case "Aguarde":
          return <SyncOutlined style={{ color: "#faad14", fontSize: 17 }} />;

        default:
          return (
            <CloseCircleTwoTone style={{ color: "#ff4d4f", fontSize: 17 }} />
          );
      }
    },
  },
  {
    title: "Envio Operativo",
    dataIndex: "comprobantes",
    align: "center",
    render: (_, r) => {
      switch (r.centroOperativo) {
        case 1:
          return (
            <Tooltip title={"Email enviado a centro operativo"}>
              {" "}
              <MailOutlined style={{ color: "#00800096", fontSize: 17 }} />{" "}
            </Tooltip>
          );

        case 2:
          return (
            <Tooltip title={"Falta Enviar email a centro operativo"}>
              {" "}
              <MailOutlined style={{ color: "#ff00008a", fontSize: 17 }} />
            </Tooltip>
          );
        case 3:
          return (
            <Tooltip title={"No contiene centro Operativo"}>
              {" "}
              <MailOutlined style={{ color: "#383838ff", fontSize: 17 }} />{" "}
            </Tooltip>
          );

        default:
          return (
            <Tooltip title={" Revisar Emision"}>
              {" "}
              <MailOutlined style={{ color: "#ff4d4f", fontSize: 17 }} />
            </Tooltip>
          );
      }
    },
  },
  {
    title: "Envio Telegram",
    dataIndex: "envia_telegram",
    align: "center",
    render: (_, r) => {
      return (
        <Tooltip
          title={
            r?.envia_telegram != null
              ? "Telegram sms enviado"
              : "Sms no enviado"
          }
        >
          <WhatsAppOutlined
            style={{
              fontSize: 17,
              color: r?.envia_telegram != null ? "#00800096" : "#ff00008a",
            }}
          />
        </Tooltip>
      );
    },
  },
];
