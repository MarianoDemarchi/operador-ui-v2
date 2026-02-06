import { Form, Select, Input, Button, Space, Divider } from "antd";
import { useState } from "react";
import { useClientesQuery } from "../../servicios/hooks/useClienteQuery";
import { useServiciosQuery } from "../../servicios/hooks/useServiciosQuery";
import { LegacyFilesUploader } from "./LotesLegacyFilesUpload";

interface Props {
  onCancel: () => void;
  onSubmit?: (values: any) => Promise<void>;
}

export const LoteCargarForm: React.FC<Props> = ({ onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const [organizacion, setOrganizacion] = useState<any>(null);
  const [servicio, setServicio] = useState<any>(null);
  const [cantArchivos, setCantArchivos] = useState<any>(null);

  const { data: organizaciones = [], isLoading } = useClientesQuery();
  const { data: servicios = [], isLoading: loadingServicios } =
    useServiciosQuery(organizacion?.base);

  const nombreArchivo = Form.useWatch("nombreArchivo", form);
  const organizacionSeleccionada = Form.useWatch("organizacion", form);
  const servicioSeleccionado = Form.useWatch("servicio", form);

  const camposRequeridosCompletos =
    !!organizacionSeleccionada &&
    !!servicioSeleccionado &&
    !!nombreArchivo &&
    cantArchivos > 0;

  const canSubmit = camposRequeridosCompletos;

  const onFinish = async (values: any) => {
    await onSubmit?.({
      ...values,
      organizacion,
      servicio,
    });

    form.resetFields();
    onCancel();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        archivos: [],
      }}
      onFinish={onFinish}
    >
      {/* Organización */}
      <Form.Item
        label="Organización"
        name="organizacion"
        rules={[{ required: true }]}
      >
        <Select
          loading={isLoading}
          placeholder="Seleccione organización"
          options={organizaciones.map((org) => ({
            label: org.nombre,
            value: org.id,
            data: org,
          }))}
          onChange={(_, option: any) => setOrganizacion(option.data)}
        />
      </Form.Item>

      {/* Servicio */}
      <Form.Item label="Servicio" name="servicio" rules={[{ required: true }]}>
        <Select
          allowClear
          disabled={!organizacion}
          loading={loadingServicios}
          placeholder="Seleccione servicio"
          options={servicios.map((srv) => ({
            label: srv.nombre,
            value: srv.id,
            data: srv,
          }))}
          onChange={(_, option: any) => setServicio(option?.data ?? null)}
        />
      </Form.Item>

      <Divider />

      {/* Nombre del archivo */}
      <Form.Item
        label="Nombre del archivo"
        name="nombreArchivo"
        rules={[
          { required: true, message: "Ingrese un nombre" },
          {
            pattern: /^\S+$/,
            message: "El nombre no puede contener espacios",
          },
        ]}
      >
        <Input
          placeholder="Ej: clientes_marzo_2026.csv"
          onChange={(e) => {
            const value = e.target.value.replace(/\s+/g, "_");
            e.target.value = value;
          }}
        />
      </Form.Item>

      {/* Archivos */}
      {servicio && organizacionSeleccionada && (
        <Form.Item label="Archivos cargados" name="archiv">
          <LegacyFilesUploader setCantArchivos={setCantArchivos} />
        </Form.Item>
      )}

      {/* Acciones */}
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button
          onClick={() => {
            form.resetFields(),
              setServicio(null),
              setOrganizacion(null),
              onCancel()
          }}
        >
          Cancelar
        </Button>
        <Button type="primary" htmlType="submit" disabled={!canSubmit}>
          Cargar archivos
        </Button>
      </Space>
    </Form>
  );
};
