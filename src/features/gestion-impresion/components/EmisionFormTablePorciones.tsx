import { Button, Space, Switch, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Porcion } from "../models/porciones-.model";
import { DeleteOutlined } from "@ant-design/icons";
interface Props {
  data: Porcion[];
  onDelete: (porcion: string) => void;
  onUpdate: (porcion: string, value: boolean) => void;
}

export const EmisionPorcionesTable: React.FC<Props> = ({
  data,
  onDelete,
  onUpdate,
}) => {
  const getEstadoUI = (p: Porcion) => {
    if (p.estado === "ok" || p.update) return "Nueva";
    if (p.estado === "error") return "Existe";
    return "Pendiente";
  };

  const columns: ColumnsType<Porcion> = [
    {
      title: "Cabecera",
      dataIndex: "cabecera",
    },
    {
      title: "Ruta",
      dataIndex: "ruta",
    },
    {
      title: "Convenio",
      dataIndex: "convenio",
    },
    {
      title: "Porción",
      dataIndex: "porcion",
    },
    {
      title: "Estado",
      render: (_, record) => {
        const estadoUI = getEstadoUI(record);

        const color =
          estadoUI === "Nueva"
            ? "green"
            : estadoUI === "Existe"
              ? "red"
              : "orange";

        const label =
          record.estado === "error" && record.update
            ? "SOBRESCRIBIR"
            : estadoUI.toUpperCase();

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Acciones",
      width: 130,
      render: (_, record) => (
        <Space>
          {record.estado === "error" && (
            <Tooltip title="Sobrescribir">
              <Switch
                size="small"
                checked={!!record.update}
                onChange={(checked) => onUpdate(record.porcion, checked)}
              />
            </Tooltip>
          )}

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.porcion)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={false}
      locale={{ emptyText: "No hay porciones cargadas" }}
    />
  );
};
