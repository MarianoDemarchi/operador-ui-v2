import { Button, Input, Popconfirm, Space } from "antd";
import {
  SendOutlined,

  DeleteOutlined,
  CloudUploadOutlined,
  FileSearchOutlined,
  WhatsAppOutlined,
  FormOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { useState } from "react";

interface Props {
  canEliminar: boolean;
  disabled: boolean;
  setOpenCreateDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenPorcionesDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDetalleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenTelegramDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenInformeDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  loadingMovimiento: boolean;
  onEliminar(): void;
  onMovimiento(): void;

  // canCancelar: boolean;
  // canDetener: boolean;
  // canSumarizar: boolean;
  // onEnviar(): void;
  // onCancelar(): void;
  // onDetener(): void;
  // onSumarizar(): void;
}
type ConfirmType = "upload" | "eliminar" | null;

export const EmisionActions: React.FC<Props> = ({
  canEliminar,
  setOpenCreateDrawer,
  setOpenPorcionesDrawer,
  setOpenDetalleDrawer,
  setOpenTelegramDrawer,
  setOpenInformeDrawer,
  onEliminar,
  onMovimiento,
  loadingMovimiento,
  disabled,

  // canCancelar,
  // canDetener,
  // canSumarizar,

  // onEnviar,
  // onCancelar,
  // onDetener,
  // onSumarizar,
}) => {
  const [openConfirm, setOpenConfirm] = useState<ConfirmType>(null);
  const [confirmText, setConfirmText] = useState("");

  return (
    <div style={{ width: 200 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          block
          type="primary"
          style={{ justifyContent: "flex-start" }}
          icon={<SendOutlined />}
          // disabled={!canGenerar}
          onClick={() => setOpenCreateDrawer(true)}
        >
          Generar
        </Button>
        <Popconfirm
          key={"upload"}
          placement="left"
          title="Subir Archivos"
          description="Estas seguro que quieres subir los archivos?"
          open={openConfirm === "upload"}
          onConfirm={onMovimiento}
          onCancel={() => setOpenConfirm(null)}
          okText="Subir"
          cancelText="Cancelar"
        >
          <Button
            key={"upload"}
            block
            style={{ justifyContent: "flex-start" }}
            type="primary"
            icon={<CloudUploadOutlined />}
            disabled={disabled}
            loading={loadingMovimiento}
            onClick={() => setOpenConfirm("upload")}
          >
            Upload
          </Button>
        </Popconfirm>
        <Button
          style={{ justifyContent: "flex-start" }}
          block
          type="primary"
          icon={<FileSearchOutlined />}
          disabled={disabled}
          onClick={() => setOpenDetalleDrawer(true)}
        >
          Detalle
        </Button>

        <Button
          style={{ justifyContent: "flex-start" }}
          block
          type="primary"
          icon={<WhatsAppOutlined />}
          disabled={disabled}
          onClick={() => setOpenTelegramDrawer(true)}
        >
          Telgram
        </Button>
        <Button
          style={{ justifyContent: "flex-start" }}
          block
          type="primary"
          icon={<FormOutlined />}
          onClick={() => setOpenInformeDrawer(true)}

          //      disabled={!canSumarizar}
        >
          Informe
        </Button>
        <Button
          style={{ justifyContent: "flex-start" }}
          block
          type="primary"
          icon={<FileAddOutlined />}
          //      disabled={!canSumarizar}
          onClick={() => setOpenPorcionesDrawer(true)}
        >
          Porciones
        </Button>
        <Popconfirm
          key={"eliminar"}
          placement="left"
          title="Eliminar registro"
          description={
            <>
              <p>
                Escribí <b>eliminar</b> para confirmar la acción
              </p>

              <Input
                placeholder="eliminar"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoFocus
              />
            </>
          }
          open={openConfirm === "eliminar"}
          onConfirm={onEliminar}
          onCancel={() => {
            setOpenConfirm(null);
            setConfirmText("");
          }}
          okText="Eliminar"
          cancelText="Cancelar"
          okButtonProps={{
            danger: true,
            disabled: confirmText !== "eliminar",
          }}
        >
          <Button
            block
            danger
            type="primary"
            icon={<DeleteOutlined />}
            disabled={!canEliminar}
            onClick={() => setOpenConfirm("eliminar")}
            style={{ justifyContent: "flex-start" }}
          >
            Eliminar
          </Button>
        </Popconfirm>
      </Space>
    </div>
  );
};
