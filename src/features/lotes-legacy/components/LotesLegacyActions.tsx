import { Button, Input, Popconfirm, Space } from "antd";
import {
  SendOutlined,
  ControlOutlined,
  FileAddOutlined,
  FormOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

type ConfirmType = "eliminar" | "enviar" | null;

interface Props {
  canEnviar: boolean;
  canCancelar: boolean;
  canSumarizar: boolean;

  onEnviar(): void;
  onCancelar(): void;
  onSumarizar(): void;
  onControl(): void;

  setOpenCreateDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenUploadDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LotesLegacyActions: React.FC<Props> = ({
  canEnviar,
  canCancelar,
  canSumarizar,
  onEnviar,
  onCancelar,
  onSumarizar,
  onControl,
  setOpenCreateDrawer,
  setOpenUploadDrawer,
}) => {
  const [openConfirm, setOpenConfirm] = useState<ConfirmType>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleEliminar = () => {
    onCancelar();
    setOpenConfirm(null);
    setConfirmText("");
  };

  const handlEnviar = () => {
    onEnviar();
    setOpenConfirm(null);
    setConfirmText("");
  };

  return (
    <div style={{ width: 200 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          block
          type="primary"
          icon={<FormOutlined />}
          style={{ justifyContent: "flex-start" }}
          onClick={() => setOpenCreateDrawer(true)}
        >
          Crear lote
        </Button>

        <Button
          block
          type="primary"
          icon={<FileAddOutlined />}
          style={{ justifyContent: "flex-start" }}
          onClick={() => setOpenUploadDrawer(true)}
        >
          Cargar
        </Button>

        <Popconfirm
          placement="left"
          title="Enviar registro"
          description={
            <>
              <p>
                Escribí <b>enviar</b> para confirmar la acción
              </p>
              <Input
                placeholder="enviar"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoFocus
              />
            </>
          }
          open={openConfirm === "enviar"}
          onConfirm={handlEnviar}
          onCancel={() => {
            setOpenConfirm(null);
            setConfirmText("");
          }}
          okText="Enviar"
          cancelText="Cancelar"
          okButtonProps={{
            danger: true,
            disabled: confirmText !== "enviar",
          }}
        >
          <Button
            block
            type="primary"
            icon={<SendOutlined />}
            style={{ justifyContent: "flex-start" }}
            disabled={!canEnviar}
            onClick={() => setOpenConfirm("enviar")}
          >
            Enviar
          </Button>
        </Popconfirm>

        <Popconfirm
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
          onConfirm={handleEliminar}
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
            style={{ justifyContent: "flex-start" }}
            disabled={!canCancelar}
            onClick={() => setOpenConfirm("eliminar")}
          >
            Eliminar
          </Button>
        </Popconfirm>

        <Button
          block
          type="primary"
          icon={<ControlOutlined />}
          style={{ justifyContent: "flex-start" }}
          disabled={!canEnviar}
          onClick={onControl}
        >
          Control
        </Button>

        <Button
          block
          type="primary"
          icon={<ReloadOutlined />}
          disabled={!canSumarizar}
          onClick={onSumarizar}
        >
          Sumarizar
        </Button>
      </Space>
    </div>
  );
};
