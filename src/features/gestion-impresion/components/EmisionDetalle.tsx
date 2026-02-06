import { useMemo } from "react";
import { Timeline, Typography, Divider } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { Emision } from "../models/emision.model";
import type { Cabecera } from "../models/cabecera.model";

const { Text } = Typography;

interface Props {
  fila?: Emision | null;
}

const EmisionDetalle: React.FC<Props> = ({ fila }) => {
  const cabeceras: Cabecera[] = useMemo(() => {
    return fila?.cabeceras ?? [];
  }, [fila?.cabeceras]);

  if (!fila || cabeceras.length === 0) return null;

  return (
    <div style={{ width: "100%" }}>
      {cabeceras.map((c) => (
        <div key={c.id_cabecera} style={{ marginBottom: 32 }}>
          <Text strong>{c.cabecera}</Text>

          <Timeline orientation="horizontal" style={{ marginTop: 16 }}>
            {/* Validación */}
            <Timeline.Item
              color={c.ok_para_subir === "si" ? "green" : "red"}
              dot={
                c.ok_para_subir === "si" ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )
              }
            >
              {c.ok_para_subir === "si"
                ? "Validación correcta"
                : "Validación incorrecta"}
            </Timeline.Item>

            {/* Subida LCI */}
            <Timeline.Item
              color={
                c.ok_upload_lci?.resultado === "0"
                  ? "green"
                  : c.ok_upload_lci
                    ? "red"
                    : "blue"
              }
              dot={
                c.ok_upload_lci?.resultado === "0" ? (
                  <CheckCircleOutlined />
                ) : c.ok_upload_lci ? (
                  <CloseCircleOutlined />
                ) : (
                  <ClockCircleOutlined />
                )
              }
            >
              {c.ok_upload_lci?.resultado === "0"
                ? "Subida de LCI correcta"
                : c.ok_upload_lci
                  ? "Subida de LCI incorrecta"
                  : "Subida de LCI pendiente"}
            </Timeline.Item>

            {/* Subida AWS */}
            <Timeline.Item
              color={
                c.ok_upload?.resultado === "0"
                  ? "green"
                  : c.ok_upload
                    ? "red"
                    : "blue"
              }
              dot={
                c.ok_upload?.resultado === "0" ? (
                  <CheckCircleOutlined />
                ) : c.ok_upload ? (
                  <CloseCircleOutlined />
                ) : (
                  <ClockCircleOutlined />
                )
              }
            >
              {c.ok_upload?.resultado === "0"
                ? "Subida AWS correcta"
                : c.ok_upload
                  ? "Subida AWS incorrecta"
                  : "Subida AWS pendiente"}
            </Timeline.Item>

            {/* Remito / Rótulo */}
            <Timeline.Item
              color={
                c.sube_rot_rem?.resultado === "0" || c.sube_rot_rem == null
                  ? "green"
                  : "red"
              }
              dot={
                c.sube_rot_rem?.resultado === "0" || c.sube_rot_rem == null ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )
              }
            >
              Subida Remito–Rótulo
              {c.imprime_CO === "si" && (
                <div style={{ color: "#888" }}>Imprime Centro Operativo</div>
              )}
            </Timeline.Item>
          </Timeline>

          <Divider />
        </div>
      ))}
    </div>
  );
};

export default EmisionDetalle;
