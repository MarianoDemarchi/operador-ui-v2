import { Table, Typography } from "antd";

import { useLegacyFilesUpload } from "../hooks/useLegacyFilesUpload";
import { useEffect } from "react";

export interface LegacyFilesUploaderProps {
  value?: File[];
  setCantArchivos: React.Dispatch<React.SetStateAction<number>>;
}

export const LegacyFilesUploader: React.FC<LegacyFilesUploaderProps> = ({
  setCantArchivos,

}) => {
  const { data } = useLegacyFilesUpload();

const files = {
  items: data?.listaArchivos ?? [],
  total: data?.listaArchivos?.length ?? 0,
  source: "legacy",
};

  useEffect(() => {
    setCantArchivos(files.total);
  }, [files, setCantArchivos]);

const columns = [
  {
    title: "Archivo",
    key: "file",
    render: (name: string) => (
      <Typography.Text>{name}</Typography.Text>
    ),
  },
];


  return (
    <>
      {files?.items?.length && (
        <Table
          size="small"
          style={{ marginTop: 12 }}
          rowKey="uid"
          dataSource={files?.items ?? []}
          columns={columns}
          pagination={false}
        />
      )}
    </>
  );
};
