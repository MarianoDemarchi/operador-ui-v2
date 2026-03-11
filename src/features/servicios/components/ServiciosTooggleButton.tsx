import {  Modal, Switch, theme } from "antd";
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

  const showConfirm = (checked: boolean) => {
    Modal.confirm({
      title: checked ? "Activar servicio" : "Desactivar servicio",
      content: (
        <>
          ¿Estás seguro que deseas{" "}
          <strong>{checked ? "activar" : "desactivar"}</strong> el servicio{" "}
          <strong>{servicio.nombre}</strong>?
        </>
      ),
      okText: checked ? "Activar" : "Desactivar",
      okButtonProps: {
        danger: !checked,
        loading,
        style: checked
          ? {
              backgroundColor: token.colorInfo,
              borderColor: token.colorInfo,
            }
          : undefined,
      },
      cancelText: "Cancelar",
      onOk: () => onConfirm(servicio),
    });
  };

  return (
    <Switch
      checked={isActive}
      loading={loading}
      checkedChildren="Activo"
      unCheckedChildren="Detenido"
      onChange={(checked) => showConfirm(checked)}
    />
  );
};
