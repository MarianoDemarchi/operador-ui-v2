import { Table } from "antd";
import { emisionColumns } from "./columns";
import type { Emision } from "../models/emision.model";
import { EmisionesRowExpand } from "./EmisionRow";
import type { Cabecera } from "../models/cabecera.model";
import { useUI } from "../../../context/UIContext";
import "../../../table_transicion.css"
interface Props {
  data: Emision[];
  selected?: Emision;
  onSelect?: (e: Emision) => void;
  isFetching: boolean;
  isLoading: boolean;
  onEnviarEmail?: (emision: Emision, cabecera: Cabecera) => void;
}

export const EmisionesTable: React.FC<Props> = ({
  data,
  selected,
  onSelect,
  isFetching,
  isLoading,
  onEnviarEmail,
}) => {
  const { showLogs } = useUI();
  return (
    <div
      className={`table-container ${showLogs ? "logs-open" : "logs-closed"}`}
    >
      <Table<Emision>
        scroll={{ y: !showLogs ? 600 : 400, x: "hidden" }}
        loading={isLoading || isFetching}
        pagination={false}
        rowKey="id_emision"
        columns={emisionColumns}
        dataSource={data}
        expandable={{
          expandedRowRender: (row) =>
            row.cabeceras ? (
              <EmisionesRowExpand
                cabecerasJson={row.cabeceras}
                onClick={(cabecera) => onEnviarEmail?.(row, cabecera)}
              />
            ) : null,
          rowExpandable: (row) => Boolean(row.cabeceras),
        }}
        rowClassName={(r) =>
          selected?.id_emision === r.id_emision ? "ant-table-row-selected" : ""
        }
        onRow={(record) => ({
          onClick: () => onSelect?.(record),
        })}
      />
    </div>
  );
};
