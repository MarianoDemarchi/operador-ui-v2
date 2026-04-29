import { Divider, Empty, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEmisionFile } from "../hooks/useEmisionDynamicFields";
import { useEffect, useMemo } from "react";

interface ArchivoInfo {
  nombreArchivo?: string;
  logId?: string;
  proceso?: string;
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
     Normalización de datos
  ========================== */
  const archivosNormalizados: ArchivoInfo[] = useMemo(() => {
    if (!data) return [];

    if (servicio === "FAC") {
      return data.archivos;
    }

    // 🔹 convertir string[] → ArchivoInfo[]
    return (data.archivosRaw ?? []).map((nombre) => ({
      proceso: `${nombre}`,
    }));
  }, [data, servicio]);

  /* =========================
     Tabla principal
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
      dataIndex: "proceso",

      key: "proceso",
      render: (_, record) =>
        record.nombreArchivo?.slice(22, 28)
          ? record.nombreArchivo?.slice(22, 28)
          : (record.proceso ?? "-"),
    },
  ];

  /* =========================
     Tabla auxiliar
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
    onFilesChange(archivosNormalizados);
  }, [data, archivosNormalizados, setCantArchivos, onFilesChange]);

  if (isLoading) {
    return <Typography.Text>Cargando...</Typography.Text>;
  }

  return (
    (data?.listaArchivos?.length ?? 0) > 0 && (
      <>
        <Table<ArchivoInfo>
          size="small"
          rowKey={(r, i) => r.logId ?? `${i}`}
          dataSource={archivosNormalizados}
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
