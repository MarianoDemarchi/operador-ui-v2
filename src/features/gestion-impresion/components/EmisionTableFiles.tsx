import { Divider, Empty, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEmisionFile } from "../hooks/useEmisionDynamicFields";
import { useEffect } from "react";

interface ArchivoInfo {
  nombreArchivo?: string;
  logId?: string;
}

export interface EmisionTableCrear {
  distribuidora: string;
  servicio: string;
  setCantArchivos: (cantidad: number) => void;
  onFilesChange: (files: any) => void;
}

export const EmisionTableFiles: React.FC<EmisionTableCrear> = ({
  distribuidora,
  servicio,
  setCantArchivos,
  onFilesChange,
  
}) => {
  const { data, isLoading } = useEmisionFile({ servicio, distribuidora });

  /* =========================
     Tabla principal (1 fila)
  ========================== */
  const columns: ColumnsType<ArchivoInfo> = [
    {
      title: "Archivo",
      dataIndex: "nombreArchivo",
      key: "archivo",
    },
    {
      title: "Log ID",
      dataIndex: "logId",
      key: "logId",
    },
    {
      title: "Proceso",
      key: "proceso",
      render: (_, record) => record.nombreArchivo?.slice(22, 28) ?? "-",
    },
  ];

  /* =========================
     Tabla de archivos extra
  ========================== */
  const columnsListaArchivoAux: ColumnsType<string> = [
    {
      title: "Archivos Complementarios",
      dataIndex: "",
      key: "archivo",
      render: (value) => <Typography.Text>{value}</Typography.Text>,
    },
  ];

  useEffect(() => {
    setCantArchivos(data?.listaArchivos?.length ?? 0);
    onFilesChange(data?.archivos ?? []);
  }, [data?.archivos, setCantArchivos]);

  if (isLoading) {
    return <Typography.Text>Cargando...</Typography.Text>;
  }

  return (
    (data?.listaArchivos?.length ?? 0) > 0 && (
      <>
        <Table<ArchivoInfo>
          size="small"
          rowKey={(r, i) => r.logId ?? `${i}`}
          dataSource={data?.archivos ?? []}
          columns={columns}
          pagination={false}
        />

        <Divider />

        <Table<string>
          locale={{
            emptyText: <Empty description="No hay archivos disponibles" />,
          }}
          size="small"
          rowKey={(record) => record}
          dataSource={data?.listaArchivos ?? []}
          columns={columnsListaArchivoAux}
          pagination={false}
        />
      </>
    )
  );
};
