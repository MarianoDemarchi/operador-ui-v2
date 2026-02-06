import { Progress, Table, Typography } from "antd";
import type { Archivo } from "../models/archivo.model";

export const LoteArchivosTable: React.FC<{ archivos: Archivo[] }> = ({
  archivos,
}) => {
  if (!archivos.length) {
    return <Typography>El lote no posee archivos asociados</Typography>;
  }

  return (
    <>
      <Table<Archivo>
        rowKey={(r) => r["ID archivo"]}
        size="small"
        pagination={false}
        dataSource={archivos}
        columns={[
          {
            title: "ID Archivo",
            dataIndex: "ID archivo",
          },
          {
            title: "Nombre",
            dataIndex: "Nombre",
          },
          {
            title: "Avance",
            dataIndex: "Avance",
            render: (value?: number) => {
              const percent = Number(value ?? 0);

              return (
                <Progress
                  percent={percent}
                  size="small"
                  status={percent === 100 ? "success" : "active"}
                  showInfo={percent === 100}
                />
              );
            },
          },
          {
            title: "Registros",
            dataIndex: "Registros",
            render: (v) => v ?? "-",
          },
        ]}
      />
    </>
  );
};
