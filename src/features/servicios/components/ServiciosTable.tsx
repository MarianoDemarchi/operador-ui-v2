import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Servicio } from "../models/servicio.model";
import { ServiciosToogleButton } from "./ServiciosTooggleButton";
import { useUI } from "../../../context/UIContext";
import "../../../table_transicion.css"

interface Props {
  data: Servicio[];
  isFetching: boolean;
  onToggle: (servicio: Servicio) => void;
}

export const ServicioTable: React.FC<Props> = ({
  data,
  isFetching,
  onToggle,
}) => {
  const { showLogs } = useUI();
  const columns: ColumnsType<Servicio> = [
    {
      title: "Servicio",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Estado",
      align: "center",
      render: (_, s) => (
        <Tag
          variant="outlined"
          style={{ fontSize: "14px" }}
          color={s.estado === 0 ? "green" : "red"}
        >
          {s.estado === 0 ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Acción",
      align: "start",
      render: (_, s) => (
        <ServiciosToogleButton servicio={s} onConfirm={onToggle} />
      ),
    },
  ];

  return (
    <div
      className={`table-container ${showLogs ? "logs-open" : "logs-closed"}`}
    >
      {data.length > 0 && (
        <Table<Servicio>
          rowKey="id"
          scroll={{ y: !showLogs ? 600 : 400, x: "hidden" }}
          size="small"
          bordered
          loading={isFetching}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      )}
    </div>
  );
};


