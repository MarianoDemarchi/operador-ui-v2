import { Table, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ArchivoLegacy } from "../models/archivo-legacy.model";
import type { LoteLegacy } from "../models/lote-legacy.model";

export const LotesRowExpand = ({ lote }: { lote: LoteLegacy }) => {
  const archivos: ArchivoLegacy[] = lote.archivos
    ? JSON.parse(lote.archivos)
    : [];

  const columns: ColumnsType<ArchivoLegacy> = [
    { title: "Nombre", dataIndex: "Nombre" },
    {
      title: "Avance",
      render: (_, r) => (
        <Progress
          percent={Number(r.Avance)}
          status={r.Avance != "100" ? "exception" : undefined}
        />
      ),
    },
    { title: "Proceso", dataIndex: "Tipo preproceso" },
  ];

  return (
    <Table
      rowKey="Nombre"
      columns={columns}
      dataSource={archivos}
      pagination={false}
      size="small"
    />
  );
};
