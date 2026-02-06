import { Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Cabecera } from "../models/cabecera.model";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  MailOutlined,
} from "@ant-design/icons";
interface Props {
  cabecerasJson: Cabecera[];
  onClick: (r: Cabecera) => void;
}

export const EmisionesRowExpand: React.FC<Props> = ({
  cabecerasJson,
  onClick,
}) => {
  console.log(cabecerasJson);
  const columns: ColumnsType<Cabecera> = [
    { title: "Cabecera", dataIndex: "cabecera" },
    { title: "ID", dataIndex: "id_cabecera" },
    { title: "Facturas", dataIndex: "comprobantes", align: "center" },
    {
      title: "Total Pág.",
      dataIndex: "total_pag_pdf",
      align: "center",
    },
    {
      title: "OK Subir",
      align: "center",
      render: (_, r) =>
        r.ok_para_subir === "si" ? (
          <CheckCircleFilled style={{ color: "#52c41a", fontSize: 17 }} />
        ) : (
          <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 17 }} />
        ),
    },
    {
      title: "Lci Ok",
      align: "center",
      render: (_, r) =>
        r.ok_upload_lci?.resultado === "0" ? (
          <CheckCircleFilled style={{ color: " #52c41a ", fontSize: 17 }} />
        ) : (
          <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 17 }} />
        ),
    },

    {
      title: "Upload",
      align: "center",
      render: (_, r) =>
        r.ok_upload?.resultado === "0" ? (
          <CheckCircleFilled style={{ color: " #52c41a ", fontSize: 17 }} />
        ) : (
          <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 17 }} />
        ),
    },
    {
      title: "Aux Ok",
      align: "center",
      render: (_, r) => {
        const ok =
          r.sube_rot_rem?.resultado !== "0" &&
          r.imprime_CO === "si" &&
          r?.envia_co_imprime?.resultado === 0;

        return ok ? (
          <Popconfirm
            title="Confirmar envío"
            description={`¿Está seguro que desea enviar el email de la cabecera ${r.id_cabecera} ? 
            Se enviara un email con los links de descarga de los archivos `}
            okText="Sí, enviar"
            cancelText="Cancelar"
            onConfirm={() => onClick(r)}
          >
            <MailOutlined
              style={{ color:  r?.envia_co_imprime?.resultado === 0 ?  "#52c41a" : "#1a25c4", fontSize: 17 }}
            />
          </Popconfirm>
        ) : (
          <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 17 }} />
        );
      },
    },
  ];

  return (
    <Table<Cabecera>
      size="small"
      pagination={false}
      rowKey="id_cabecera"
      columns={columns}
      dataSource={cabecerasJson}
    />
  );
};
