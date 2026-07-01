import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { LoteLegacy } from "../models/lote-legacy.model";
import { LotesRowExpand } from "./LotesLegacyRow";
import { useUI } from "../../../context/UIContext";
import "../../../table_transicion.css";
import { useCallback } from "react";
import { SyncOutlined } from "@ant-design/icons";
interface Props {
  data: LoteLegacy[];
  onSelect: (lote: LoteLegacy) => void;
  selected?: LoteLegacy;
  isFetching: boolean;
  isLoading: boolean;
}

export const LotesLegacyTable: React.FC<Props> = ({
  data,
  onSelect,
  selected,
  isFetching,
  isLoading,
}) => {
  const { showLogs } = useUI();

  const renderEstado = useCallback((estado: string) => {
    const map: Record<string, string> = {
      "Enviado OK": "green",
      "Preparado OK": "blue",
      "Preparado ERROR": "red",
      Preparando: "orange",
      Enviando: "orange",
    };
    return (
      <Tag color={map[estado] ?? "default"}>
        {estado}
        {estado === "Enviando" || estado === "Preparando" ? (
          <SyncOutlined spin style={{ marginLeft: 6 }} />
        ) : (
          ""
        )}
      </Tag>
    );
  }, []);

  const columns: ColumnsType<LoteLegacy> = [
    {
      title: "ID Lote",
      dataIndex: "id_lote",
      responsive: ["md"], // se oculta primero
      ellipsis: true,
      width: 120,
    },
    {
      title: "Cliente",
      dataIndex: "nombre",
      responsive: ["sm"], // se oculta en mobile
      ellipsis: true,
      width: 120,
    },
    {
      title: "Nombre",
      dataIndex: "l_nombre",
      ellipsis: true,

      // 👇 siempre visible (columna principal)
    },
    {
      title: "Preparado",
      responsive: ["sm"], // visible desde tablet
      ellipsis: true,
      width: "10%",

      render: (_, r) =>
        r.estado === "Preparado OK" ? r.ts_preparado : r.ts_enviado,
    },
    {
      title: "Estado",
      // 👇 siempre visible (clave UX)
      render: (_, r) => renderEstado(r.estado),
      width: "10%",
    },
    {
      title: "Mensajes",
      align: "right",
      width: 100,
      render: (_, r) => Number(r.mensajes ?? 0).toLocaleString("es-AR"),
    },
    {
      title: "Entregados",
      align: "right",
      width: 100,
      render: (_, r) => String(r.entregados ?? ""),
    },
    {
      title: "Rebotados",
      align: "right",
      width: 100,
      render: (_, r) => String(r.rebotados ?? ""),
    },
  ];

  return (
    <div
      className={`table-container ${showLogs ? "logs-open" : "logs-closed"}`}
    >
      <Table
        loading={isLoading || isFetching}
        pagination={false}
        sticky
        scroll={{ y: !showLogs ? 700 : 400, x: "hidden" }}
        rowKey="id_lote"
        columns={columns}
        dataSource={data?.filter(
    (e) =>
      !(e.l_nombre?.includes("FD") && !e.l_nombre?.includes("REENVIO"))
  )}
        expandable={{
          expandedRowRender: (row) => <LotesRowExpand lote={row} />,
          rowExpandable: (row) => row.estado !== "Enviado OK",
        }}
        rowClassName={(r) => {
          const classes: string[] = [];

          if (selected?.id_lote === r.id_lote) {
            classes.push("ant-table-row-selected");
          }

          if (r.estado === "Preparado OK") {
            classes.push("row-ok");
          }

          if (r.estado === "Error") {
            classes.push("row-error");
          }

          return classes.join(" ");
        }}
        onRow={(record) => ({
          onClick: () => onSelect(record),
        })}
      />
    </div>
  );
};
