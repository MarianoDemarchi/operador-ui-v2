import { Table, Tag, Tooltip, Progress, Typography, Descriptions } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CalendarOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";

const { Text } = Typography;

/**
 * Tipos
 */
export interface Lote {
  id_lote?: number | string;
  nombre_lote?: string;
  pct_procesados?: string | number;
  pct_rebotados?: string | number;
  alerta?: string;
  descripcion?: string;
  fecha_inicio_eventos?: string;
  fecha_fin_eventos?: string;
  total_enviados?: number;
  total_procesados?: number;
  total_rebotes?: number;
}

interface Props {
  lotes?: Lote[];
  url?: string;
}
const MonitoreoAnomalias: React.FC<Props> = ({ lotes }) => {
  const REBOTE_CRITICO = 30;
  const PROCESADO_MINIMO = 50;

  const columns: ColumnsType<Lote> = [
    {
      title: "Lote",
      dataIndex: "nombre_lote",
      key: "nombre_lote",
      width: 250,
      render: (nombre_lote: string | undefined, record: Lote) => (
        <Tooltip placement="topLeft" title={nombre_lote}>
          <Text
            copyable={{
              text: record.id_lote?.toString() || "",
              tooltips: ["Copiar Id_lote", "Copiado"],
            }}
          >
            {nombre_lote}
          </Text>
        </Tooltip>
      ),
    },

    {
      title: "% Procesados",
      dataIndex: "pct_procesados",
      key: "pct_procesados",
      width: 140,
      render: (val: string | number | undefined) => {
        const num = Number(val) * 100;
        if (isNaN(num)) return "-";

        return (
          <Progress
            percent={Number(num.toFixed(2))}
            size="small"
            strokeColor={num < PROCESADO_MINIMO ? "#ff4d4f" : "#52c41a"}
            status={num < PROCESADO_MINIMO ? "exception" : "normal"}
            format={(p) => `${p}%`}
          />
        );
      },
    },

    {
      title: "% Rebotes",
      dataIndex: "pct_rebotados",
      key: "pct_rebotados",
      width: 140,
      render: (val: string | number | undefined) => {
        const num = Number(val) * 100;
        if (isNaN(num)) return "-";

        return (
          <Progress
            percent={Number(num.toFixed(2))}
            size="small"
            strokeColor={num > REBOTE_CRITICO ? "#ff4d4f" : "#1890ff"}
            status={num > REBOTE_CRITICO ? "exception" : "normal"}
            format={(p) => `${p}%`}
          />
        );
      },
    },

    {
      title: "Alerta",
      dataIndex: "alerta",
      key: "alerta",
      width: 90,
      render: (val: string | undefined) =>
        val && val.toLowerCase() !== "ok" ? (
          <Tag color="red">{val}</Tag>
        ) : (
          <Tag color="green">OK</Tag>
        ),
    },
  ];

  const expandedRowRender = (record: Lote) => (
    <div className="table-expanded-content">
      <Descriptions
        title={
          <Paragraph style={{ margin: 0 }}>Detalles adicionales</Paragraph>
        }
        size="small"
        column={2}
        style={{ marginLeft: 55 }}
        bordered
        labelStyle={{ fontWeight: "bold" }}
        contentStyle={{ whiteSpace: "nowrap" }}
      >
        <Descriptions.Item
          label={
            <>
              <CalendarOutlined className="table-description-label" /> Servicio
            </>
          }
        >
          {record.descripcion || "-"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CalendarOutlined className="table-description-label" /> Desde
            </>
          }
        >
          {record.fecha_inicio_eventos || "-"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CalendarOutlined className="table-description-label" /> Hasta
            </>
          }
        >
          {record.fecha_fin_eventos || "-"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <SendOutlined className="table-description-label" /> Enviados
            </>
          }
        >
          {record.total_enviados ?? "-"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CheckCircleOutlined className="table-description-label" />{" "}
              Procesados
            </>
          }
        >
          {record.total_procesados ?? "-"}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <CloseCircleOutlined className="table-description-label" />{" "}
              Rebotes
            </>
          }
        >
          {record.total_rebotes ?? "-"}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  return (
    <Table<Lote>
      className="table-monitoreo"
      size="small"
      dataSource={lotes}
      columns={columns}
      rowKey={(record) => record.id_lote ?? Math.random()}
      pagination={false}
      scroll={{ x: "max-content" }}
      expandable={{
        expandedRowRender,
        rowExpandable: () => true,
      }}
    />
  );
};

export default MonitoreoAnomalias;
