import {
  Form,
  Select,
  Button,
  Space,
  Divider,
  DatePicker,
  message,
} from "antd";
import { useState } from "react";

import { EmisionTableFiles } from "./EmisionTableFiles";
import { useEmisionActions } from "../hooks/useEmisionActions";
import dayjs from "dayjs";

interface Props {
  onCancel: () => void;
}

export const EmisionFormCrear: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm();
  const { crear } = useEmisionActions();

  const [distribuidora, setDistribuidora] = useState<any>(null);
  const [servicio, setServicio] = useState<any>(null);
  const [cantArchivos, setCantArchivos] = useState<any>(null);
  const [archivos, setArchivos] = useState<any[]>([]);
  const servicios = [
    { label: "Facturas Comunes", key: "FAC" },
    { label: "Facturas Rebotes", key: "FAR" },
    { label: "Avisos de Deuda", key: "AVD" },
    { label: "Notas Especiales", key: "NOT" },
    { label: "Aviso de Deuda Reg y Flex", key: "AVR" },
  ];

  const distribuidoras = [
    { label: "Centro", key: "CTR" },
    { label: "Cuyo", key: "CUY" },
  ];

  //   const { data: servicios = [], isLoading: loadingServicios } =
  //     useServiciosQuery(organizacion?.base);

  const servicioSeleccionado = Form.useWatch("servicio", form);
  const distribuidoraSeleccionado = Form.useWatch("distribuidora", form);
  const fechaEmisionSeleccionado = Form.useWatch("fechaEmision", form);
  const camposRequeridosCompletos =
    !!fechaEmisionSeleccionado &&
    !!servicioSeleccionado &&
    !!distribuidoraSeleccionado &&
    cantArchivos > 0;

  const canSubmit = camposRequeridosCompletos;
  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      fechaImpresion: values.fechaEmision
        ? dayjs(values.fechaEmision).format("YYYY-MM-DD")
        : null,
      servicio,
      distribuidora,
      archivos: archivos.map((a) =>
        servicio === "FAC"
          ? { archivoP: a.nombreArchivo, logId: a.logId }
          : { logId: a.logId },
      ),
    };

    try {
      await crear.mutateAsync(payload);

      // ✅ SOLO si el servidor respondió OK
      form.resetFields();
      onCancel();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "Ocurrió un error inesperado",
        10,
      );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        archiv: [],
      }}
      onFinish={onFinish}
    >
      {/* Organización */}
      <Form.Item label="Servicio" name="servicio" rules={[{ required: true }]}>
        <Select
          allowClear
          placeholder="Seleccione organización"
          options={servicios.map((ser) => ({
            label: ser.label,
            value: ser.key,
            data: ser,
          }))}
          onChange={(_, option: any) => setServicio(option?.data.key ?? null)}
        />
      </Form.Item>

      {/* Servicio */}
      {form.getFieldValue("servicio") && (
        <Form.Item
          label="Distribuidoras"
          name="distribuidora"
          rules={[{ required: true }]}
        >
          <Select
            allowClear
            disabled={!form.getFieldValue("servicio")}
            placeholder="Seleccione servicio"
            options={distribuidoras.map((dis) => ({
              label: dis.label,
              value: dis.key,
              data: dis,
            }))}
            onChange={(_, option: any) =>
              setDistribuidora(option?.data.key ?? null)
            }
          />
        </Form.Item>
      )}
      <Form.Item
        name={"fechaEmision"}
        key={"dataPickerPapel"}
        label={"Fecha de Emision"}
        required
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Divider />
      <EmisionTableFiles
        setCantArchivos={setCantArchivos}
        servicio={servicio}
        distribuidora={distribuidora}
        onFilesChange={setArchivos}
      />

      {/* Archivos */}
      {/* {servicio && organizacionSeleccionada && (
   
      )} */}

      {/* Acciones */}
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button
          loading={crear.isPending}
          type="primary"
          htmlType="submit"
          disabled={!canSubmit}
        >
          Generar
        </Button>
      </Space>
    </Form>
  );
};
