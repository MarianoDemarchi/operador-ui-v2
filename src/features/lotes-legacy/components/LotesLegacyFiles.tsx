import { Empty, Table, Typography, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLegacyFiles } from "../hooks/useLegacyFiles";
import { useFilteredLegacyFiles } from "../hooks/useFilteredLegacyFiles";
import { useEffect } from "react";

export interface LegacyFilesTableProps {
  tipo: string;
  filtros: Record<string, string>;
  mascara: Record<string, string>;

  setCantArchivos: React.Dispatch<React.SetStateAction<number>>;
  setArchivos: React.Dispatch<React.SetStateAction<any[]>>;
  setArchivosAdjuntos: React.Dispatch<React.SetStateAction<any[]>>;
  setCantAdjuntos: React.Dispatch<React.SetStateAction<number>>;

  onChange: (file: string) => void;
}

export const LegacyFilesTable = ({
  filtros,
  mascara,
  setCantArchivos,
  setArchivos,
  setArchivosAdjuntos,
  setCantAdjuntos,
}: LegacyFilesTableProps) => {
  const { data, isLoading } = useLegacyFiles();

  // ARCHIVOS
  const files = useFilteredLegacyFiles({
    files: data?.listaArchivos ?? [],
    filtros,
    mascara,
  });

  // ADJUNTOS
  const adjuntos = data?.listaAdjuntos ?? [];

  useEffect(() => {
    setCantArchivos(files.length);

    setArchivos((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(files)) {
        return prev;
      }

      return files;
    });
  }, [files]);

  useEffect(() => {
    setCantAdjuntos(adjuntos.length);

    setArchivosAdjuntos((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(adjuntos)) {
        return prev;
      }

      return adjuntos;
    });
  }, [adjuntos]);

  const columns: ColumnsType<string> = [
    {
      title: "Archivo",
      dataIndex: "",
      key: "archivo",
      render: (value: string) => <Typography.Text>{value}</Typography.Text>,
    },
  ];

  const columnsAdjunto: ColumnsType<string> = [
    {
      title: "Archivo Adjunto",
      dataIndex: "",
      key: "archivo adjunto",
      render: (value: string) => <Typography.Text>{value}</Typography.Text>,
    },
  ];
  if (isLoading) {
    return <Typography.Text>Cargando archivos…</Typography.Text>;
  }

  return (
    <>
      {/* ADJUNTOS */}
      {adjuntos?.length > 0 && (
        <Table<string>
          locale={{
            emptyText: <Empty description="No hay adjuntos disponibles" />,
          }}
          size="small"
          rowKey={(record) => `adj-${record}`}
          dataSource={adjuntos}
          columns={columnsAdjunto}
          pagination={false}
        />
      )}
      <Divider />

      {/* ARCHIVOS */}
      <Table<string>
        locale={{
          emptyText: <Empty description="No hay archivos disponibles" />,
        }}
        size="small"
        rowKey={(record) => record}
        dataSource={files}
        columns={columns}
        pagination={false}
      />
    </>
  );
};
