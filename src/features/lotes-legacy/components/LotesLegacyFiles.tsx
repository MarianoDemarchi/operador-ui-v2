import { Empty, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLegacyFiles } from "../hooks/useLegacyFiles";
import { useFilteredLegacyFiles } from "../hooks/useFilteredLegacyFiles";
import { useEffect } from "react";

export interface LegacyFilesTableProps {
  tipo: string;
  filtros: Record<string, string>;
  mascara: Record<string, string>;
  setCantArchivos: React.Dispatch<React.SetStateAction<number>>;
  onChange: (file: string) => void;
}

export const LegacyFilesTable = ({
  filtros,
  mascara,
  setCantArchivos,
}: LegacyFilesTableProps) => {
  const { data, isLoading } = useLegacyFiles();

  const files = useFilteredLegacyFiles({
    files: data?.listaArchivos ?? [],
    filtros,
    mascara,
  });

  // 👈 Actualizamos la cantidad de archivos solo cuando `files` cambian
  useEffect(() => {
    setCantArchivos(files.length);
  }, [files, setCantArchivos]);

  const columns: ColumnsType<string> = [
    {
      title: "Archivo",
      dataIndex: "",
      key: "archivo",
      render: (value: string) => <Typography.Text>{value}</Typography.Text>,
    },
  ];

  if (isLoading) {
    return <Typography.Text>Cargando archivos…</Typography.Text>;
  }

  return (

      <Table<string>
        locale={{
          emptyText: <Empty description="No hay archivos disponibles"></Empty>,
        }}
        size="small"
        rowKey={(record) => record}
        dataSource={files}
        columns={columns}
        pagination={false}
      />
    
  );
};
