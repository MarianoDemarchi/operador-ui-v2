import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { LoteLegacy } from "../models/lote-legacy.model";
import { LotesRowExpand } from "./LotesLegacyRow";
import { useUI } from "../../../context/UIContext";
import "../../../table_transicion.css"

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
  const columns: ColumnsType<LoteLegacy> = [
    { title: "ID Lote", dataIndex: "id_lote" },
    { title: "Cliente", dataIndex: "nombre" },
    { title: "Nombre", dataIndex: "l_nombre", width: 500 },
    { title: "Estado", dataIndex: "estado" },
    {
      title: "Mensajes",
      render: (_, r) => Number(r.mensajes ?? 0).toLocaleString("es-AR"),
    },
    {
      title: "Rebotados",
      render: (_, r) => String(r.entregados ?? ""),
    },
    {
      title: "Entregados",
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
        dataSource={data}
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
