import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { LogLote } from "../models/log.model";
import { useEffect, useMemo, useRef } from "react";

interface Props {
  data: LogLote[];
  loading: boolean;
}

export const LogLotesTable: React.FC<Props> = ({ data, loading }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al llegar un nuevo evento
  useEffect(() => {
    if (!tableRef.current) return;
    tableRef.current.scrollTop = 0;
  }, [data.length]);

  const columns = useMemo<ColumnsType<LogLote>>(
    () => [
      {
        title: "Hora",
        dataIndex: "hora",
        key: "hora",
        width: 150,
        render: (hora) => <Typography.Text strong>{hora}</Typography.Text>,
      },
      {
        title: "ID Lote",
        dataIndex: "id_lote",
        key: "id_lote",
        width: 90,
        render: (_, record) => (
          <Typography.Text
            type={record.nivel === "error" ? "danger" : "secondary"}
          >
            {record.id_lote}
          </Typography.Text>
        ),
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        width: 180,
        ellipsis: true,
        render: (_, record) => (
          <Typography.Text
            type={record.nivel === "error" ? "danger" : "secondary"}
          >
            {record.nombre}
          </Typography.Text>
        ),
      },
      {
        title: "Módulo",
        dataIndex: "modulo",
        key: "modulo",
        width: 140,
      },
      {
        title: "Nivel",
        dataIndex: "nivel",
        key: "nivel",
        width: 90,
        render: (nivel) => (
          <Tag
            color={
              nivel === "error" ? "red" : nivel === "warn" ? "orange" : "green"
            }
          >
            {nivel.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Texto",
        dataIndex: "texto",
        key: "texto",
        ellipsis: true,
        render: (_, record) => (
          <Typography.Text
            type={record.nivel === "error" ? "danger" : undefined}
          >
            {record.texto}
          </Typography.Text>
        ),
      },
    ],
    []
  );

  return (
    <div ref={tableRef}>
      <Table
        sticky
        virtual
        size="small"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 400 }}
        rowKey={(record) => `${record.hora}-${record.texto}`}

      />
    </div>
  );
};
