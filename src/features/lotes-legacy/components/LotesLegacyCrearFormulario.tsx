import { Form, Select, DatePicker, Button, Space, Divider, Radio } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useCreateLoteLegacy } from "../hooks/useCreateLoteLegacy";
import { useClientesQuery } from "../../servicios/hooks/useClienteQuery";
import { useServiciosQuery } from "../../servicios/hooks/useServiciosQuery";
import { DynamicFields } from "./LotesLegacyComponentDynamic";
import { LegacyFilesTable } from "./LotesLegacyFiles";

interface Props {
  onCancel: () => void;
}

export const LoteForm: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm();

  const [organizacion, setOrganizacion] = useState<any>(null);
  const [servicio, setServicio] = useState<any>(null);
  const [mascaras, setMascaras] = useState<Record<string, string>>({});
  const [cantArchivos, setCantArchivos] = useState<any>(0);

  const [archivos, setArchivos] = useState<any[]>([]);
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<any[]>([]);
  const { mutateAsync: crearLote, isPending } = useCreateLoteLegacy();

  const { data: organizaciones = [], isLoading } = useClientesQuery();
  const { data: servicios = [], isLoading: loadingServicios } =
    useServiciosQuery(organizacion?.base);

  const etiquetas = Form.useWatch("etiquetas", form);

  const organizacionSeleccionada = Form.useWatch("organizacion", form);
  const servicioSeleccionado = Form.useWatch("servicio", form);
  const etiquetasSeleccionadas = Form.useWatch("etiquetas", form);
  const recepcionSeleccionada = Form.useWatch("recepcion", form);

  const camposRequeridosCompletos =
    !!organizacionSeleccionada &&
    !!servicioSeleccionado &&
    !!recepcionSeleccionada &&
    cantArchivos > 0 &&
    etiquetasSeleccionadas &&
    Object.values(etiquetasSeleccionadas).every(
      (v) => v !== undefined && v !== null && v !== "",
    );

  const canSubmit = camposRequeridosCompletos;
  const buildMascara = (mascaras?: Record<string, string>) => {
    if (!mascaras || Object.keys(mascaras).length === 0) {
      return "***";
    }

    const orden = Object.keys(mascaras);
    const valores = orden
      .map((key) => mascaras[key])
      .filter((v) => v !== undefined && v !== null && v !== "");
    if (!valores.length) return "***";
    return `*${valores.join("*")}*`;
  };

  const onFinish = async (values: any) => {
    const parsed = {
      ...values,
      recepcion: values.recepcion?.subtract(3, "hour").format("YYYY-MM-DD"),
      etiquetas: Object.fromEntries(
        Object.entries(values.etiquetas || {}).map(([k, v]: any) => [
          k,
          dayjs.isDayjs(v) ? v.format("DD-MM-YYYY") : v,
        ]),
      ),
    };

    const data = {
      version: "v2",
      etiquetas: parsed.etiquetas,
      recepcion: parsed.recepcion,
      id_servicio: values.servicio,
      diaEtiqueta: parsed.recepcion,
      base: organizacion.base,
      id_cliente: values.organizacion,
      cod_cliente: organizacion.codigo,
      cod_servicio: servicio.codigo,
      canal: values.canal.charAt(0),
      archiv: archivos,
      archivoAdjunto: archivosAdjuntos, // 👈 FIX
      mascara: buildMascara(mascaras), // 👈 FIX ACA
      nombre: "",
    };

    console.log(data);

    await crearLote(data);

    form.resetFields();
    setOrganizacion(null);
    setServicio(null);
    onCancel();
  };

  const mascaraMemo = useMemo(
    () => ({
      Canal: form.getFieldValue("canal"),
      Organizacion: JSON.stringify(organizacion),
      Servicios: JSON.stringify(servicio),
      ...mascaras,
    }),

    [form.getFieldValue("canal"), organizacion?.id, servicio?.id, mascaras],
  );

  useEffect(() => {
    if (!servicio || !organizacion) return;

    setMascaras({});
    form.setFieldsValue({
      archivos: [],
      etiquetas: {},
    });
  }, [servicio?.id, organizacion?.id]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        canal: "email",
        recepcion: dayjs(),
        etiquetas: { Dia: dayjs() },
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
          disabled={!organizacion}
          loading={loadingServicios}
          placeholder="Seleccione servicio"
          options={servicios.map((srv) => ({
            label: srv.nombre,
            value: srv.id,
            data: srv,
          }))}
          onChange={(_, option: any) => setServicio(option.data)}
        />
      </Form.Item>

      <Divider />

      {/* Campos dinámicos */}
      {servicio && organizacion && (
        <Form.Item name="etiquetas" rules={[{ required: true }]}>
          <DynamicFields
            key={`${organizacion.id}-${servicio.id}`}
            servicioId={servicio.id}
            base={organizacion.base}
            onChange={(values, masks) => {
              console.log("ESTASSSSSSSSSSSSSSSSSS", masks);
              form.setFieldValue("etiquetas", values);
              setMascaras(masks);
            }}
          />
        </Form.Item>
      )}

      {/* Recepción */}
      <Form.Item label="Recepción" name="recepcion">
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      {/* Canal */}
      <Form.Item label="Canal" name="canal">
        <Radio.Group>
          <Radio value="email">Email</Radio>
          <Radio value="sms">SMS</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Archivos */}
      {servicio && (
        <Form.Item
          name={"archivos"}
          label={`Archivos disponibles (${cantArchivos})`}
        >
          <LegacyFilesTable
            setArchivos={setArchivos}
            setArchivosAdjuntos={setArchivosAdjuntos}
            tipo="ListarArchivos"
            filtros={etiquetas}
            setCantArchivos={setCantArchivos}
            mascara={mascaraMemo}
            onChange={(file) => {
              const current = form.getFieldValue("archivos") ?? [];

              if (!current.includes(file)) {
                form.setFieldValue("archivos", [...current, file]);
              }
            }}
          />
        </Form.Item>
      )}

      {/* Acciones */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          padding: "12px 24px",
          zIndex: 10,
        }}
      >
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button
            onClick={() => {
              form.resetFields();
              setOrganizacion(null);
              setServicio(null);
              onCancel();
            }}
          >
            Cancelar
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            disabled={!canSubmit}
            loading={isPending}
          >
            Crear lote
          </Button>
        </Space>
      </div>
    </Form>
  );
};
