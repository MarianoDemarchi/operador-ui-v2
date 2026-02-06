import { Button, Form, Input, Select } from "antd";
import type { Porcion } from "../models/porciones-.model";
import { useCabecerasQuery } from "../hooks/useEmisionCabeceras";
interface Props {
  onAdd: (porcion: Porcion) => void;
}

export const EmisionFormPorciones: React.FC<Props> = ({  onAdd }) => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const nuevaPorcion: Porcion = {
      cabecera: values.cabecera,
      ruta: values.ruta,
      convenio: values.convenio,
      porcion: values.porcion,
      estado: "pending", // estado inicial
    };

    onAdd(nuevaPorcion);
    form.resetFields();
  };

  const { data: cabeceras = [], isLoading: loadingCabeceras } =
    useCabecerasQuery();
  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Cabecera"
          name="cabecera"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Select
            showSearch
            placeholder="Buscar cabecera"
            options={cabeceras}
            loading={loadingCabeceras}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Ruta"
          name="ruta"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Convenio"
          name="convenio"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Select
            placeholder="Seleccionar convenio"
            options={[
              { label: "Convenio A", value: "A" },
              { label: "Convenio S", value: "S" },
              { label: "Convenio N", value: "N" },
            ]}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Porción"
          name="porcion"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Agregar
        </Button>
      </Form>
    </>
  );
};
