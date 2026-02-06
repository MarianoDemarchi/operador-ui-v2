import { Table } from "antd";
import type { Tarea } from "../models/tarea.model";
import { useState } from "react";
import type { TableRowSelection } from "antd/es/table/interface";
import { tareaColumns } from "./columns";
import { useUI } from "../../../context/UIContext";
import "../../../table_transicion.css"

export const TareaTable: React.FC<{
  onSelect: (tarea: Tarea) => void;
  data: Tarea[];
  loading: boolean;
  isFetching: boolean;
}> = ({ data, isFetching, onSelect }) => {
  const { showLogs } = useUI();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<Tarea> = {
    type: "radio", // tipo correcto
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      setSelectedRowKeys(keys);
      console.log("Fila seleccionada:", selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
      disabled: record.tiempo_excedido.charAt(0) === "-", // solo seleccionables
    }),
    hideSelectAll: true,
  };

  const toggleRowSelection = (record: Tarea) => {
    if (record.tiempo_excedido.charAt(0) === "-") return; // solo seleccionables
    onSelect(record);
    const key = record.id_lote;
    if (selectedRowKeys.includes(key)) {
      setSelectedRowKeys([]); // si ya estaba seleccionada, deselecciona
    } else {
      setSelectedRowKeys([key]); // selecciona solo esta fila
    }
  };

  return (
    <div
      className={`table-container ${showLogs ? "logs-open" : "logs-closed"}`}
    >
      <Table<Tarea>
        scroll={{ y: !showLogs ? 700 : 400, x: "hidden" }}
        rowKey="id_lote"
        size="small"
        pagination={false}
        loading={isFetching}
        columns={tareaColumns}
        dataSource={data}
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => toggleRowSelection(record), // clic sobre fila
          style: {
            cursor:
              record.tiempo_excedido.charAt(0) !== "-"
                ? "pointer"
                : "not-allowed",
            backgroundColor: selectedRowKeys.includes(record.id_lote)
              ? "#e6f7ff" // resalta la fila seleccionada
              : undefined,
          },
        })}
      />
    </div>
  );
};
