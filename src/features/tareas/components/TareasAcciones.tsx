import { Button, Space } from "antd";


interface Props {
  onEnviar(): void;
  canReenvio: boolean;
}

export const TareasAcciones: React.FC<Props> = ({ onEnviar, canReenvio }) => {

  return (
    <Space direction="vertical" style={{ marginTop: 24 }}>
      <Button type="primary" onClick={onEnviar} disabled={!canReenvio}>
        Crear Reenvio
      </Button>
      {/* <Button
        type="primary"
        disabled={
          !filasArray ||
          filasArray.tiempo_excedido.charAt(0) === "-" ||
          filasArray.tipo_tarea !== "reporte"
        }
      >
        Generar Informes
      </Button> */}
    </Space>
  );
};
