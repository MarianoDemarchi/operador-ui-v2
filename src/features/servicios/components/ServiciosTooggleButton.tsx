import { Button, Modal, theme } from "antd";
import type { Servicio } from "../models/servicio.model";

interface Props {
  servicio: Servicio;
  onConfirm: (servicio: Servicio) => void;
  loading?: boolean;
}

export const ServiciosToogleButton: React.FC<Props> = ({
  servicio,
  onConfirm,
  loading,
}) => {
  const { token } = theme.useToken();

  const isActive = servicio.estado === 0;

  const showConfirm = () => {
    Modal.confirm({
      title: isActive ? "Desactivar servicio" : "Activar servicio",
      content: (
        <>
          ¿Estás seguro que deseas{" "}
          <strong>{isActive ? "desactivar" : "activar"}</strong> el servicio{" "}
          <strong>{servicio.nombre}</strong>?
        </>
      ),
      okText: isActive ? "Desactivar" : "Activar",
      okButtonProps: {
        danger: isActive,
        loading,
        style: !isActive
          ? {
              backgroundColor: token.colorSuccess,
              borderColor: token.colorSuccess,
            }
          : undefined,
      },
      cancelText: "Cancelar",
      onOk: () => onConfirm(servicio),
    });
  };

  return (
    <Button
      size="small"
      type="primary"
      danger={isActive}
      onClick={showConfirm}
      style={
        !isActive
          ? {
              backgroundColor: token.colorSuccess,
              borderColor: token.colorSuccess,
            }
          : undefined
      }
    >
      {isActive ? "Desactivar" : "Activar"}
    </Button>
  );
};
