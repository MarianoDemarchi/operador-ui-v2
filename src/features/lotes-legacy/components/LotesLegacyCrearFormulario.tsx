import {
  Form, Select, DatePicker, Button, Space, Divider, Radio, Input, Alert,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useCreateLoteLegacy,
  useCreateLoteLegacyMuestra,
} from "../hooks/useCreateLoteLegacy";
import { useClientesQuery } from "../../servicios/hooks/useClienteQuery";
import { useServiciosQuery } from "../../servicios/hooks/useServiciosQuery";
import { DynamicFields } from "./LotesLegacyComponentDynamic";
import { LegacyFilesTable } from "./LotesLegacyFiles";

interface Props {
  onCancel: () => void;
}

export const LoteForm: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [muestraEnviada, setMuestraEnviada] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState("");
  const envioEnCurso = useRef(false);
  const valoresActuales = Form.useWatch([], form);

  const [organizacion, setOrganizacion] = useState<any>(null);
  const [servicio, setServicio] = useState<any>(null);
  const [mascaras, setMascaras] = useState<Record<string, string>>({});
  const [cantArchivos, setCantArchivos] = useState<any>(0);

  const [archivos, setArchivos] = useState<any[]>([]);
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<any[]>([]);
  const { mutateAsync: crearLote, isPending } = useCreateLoteLegacy();
  const { mutateAsync: crearMuestra, isPending: isPendingMuestra } =
    useCreateLoteLegacyMuestra();
  const isCreating = isPending || isPendingMuestra;

  const { data: organizaciones = [], isLoading } = useClientesQuery();
  const { data: servicios = [], isLoading: loadingServicios } =
    useServiciosQuery(organizacion?.base);

  const etiquetas = Form.useWatch("etiquetas", form);

  const organizacionSeleccionada = Form.useWatch("organizacion", form);
  const servicioSeleccionado = Form.useWatch("servicio", form);
  const etiquetasSeleccionadas = Form.useWatch("etiquetas", form);
  const recepcionSeleccionada = Form.useWatch("recepcion", form);
  const puedeEnviarMuestra =
    organizacion?.codigo === "ACSA" &&
    organizacion?.id === organizacionSeleccionada &&
    !!servicioSeleccionado &&
    servicio?.id === servicioSeleccionado;

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
  const buildMascara = (mascaras?: Record<string, string>, servicio?: any) => {
    if (!mascaras || Object.keys(mascaras).length === 0) {
      return "***";
    }

    const valores = Object.values(mascaras).filter(Boolean);

    const mascaraPrincipal = `*${valores.join("*")}*`;

    if (servicio?.codigo === "FDENSU") {
      return `${mascaraPrincipal};*legajo*`;
    }

    return mascaraPrincipal;
  };

  const buildPayload = (values: any) => {
    const parsed = {
      ...values,
      recepcion: values.recepcion?.subtract(3, "hour").format("YYYY-MM-DD"),
      etiquetas: Object.fromEntries(
        Object.entries(values.etiquetas || {}).map(([k, v]: any) => {
          const esPeriodoAcsa =
            organizacion?.codigo === "ACSA" &&
            k.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === "periodo";
          const valor = dayjs.isDayjs(v) ? v.format("DD-MM-YYYY") : v;
          return [
            k,
            esPeriodoAcsa && typeof valor === "string"
              ? valor.replaceAll("-", "/")
              : valor,
          ];
        }),
      ),
    };

    return {
      version:
        organizacion?.codigo === "ACSA" && window.location.hostname === "localhost"
          ? "v3"
          : "",
      etiquetas: parsed.etiquetas,
      recepcion: parsed.recepcion,
      id_servicio: values.servicio,
      diaEtiqueta: parsed.recepcion,
      base: organizacion?.base,
      id_cliente: values.organizacion,
      cod_cliente: organizacion?.codigo,
      cod_servicio: servicio?.codigo,
      canal: values.canal?.charAt(0),
      archiv: archivos,
      archivoAdjunto: archivosAdjuntos, // 👈 FIX
      mascara: buildMascara(mascaras, servicio),
      nombre: "",
    };
  };

  const requiereMuestra = organizacion?.codigo === "ACSA";
  const confirmacionEsperada = requiereMuestra
    ? `enviar ${servicio?.codigo ?? ""}`
    : "enviar";
  const confirmacionValida =
    confirmacion === confirmacionEsperada &&
    (!requiereMuestra || !!servicio?.codigo);
  const muestraVigente =
    muestraEnviada !== null &&
    muestraEnviada === JSON.stringify(buildPayload(valoresActuales ?? {}));
  const puedeEnviarLote = canSubmit && (!requiereMuestra || muestraVigente);

  const onFinish = async (values: any, esMuestra = false) => {
    if (envioEnCurso.current || !canSubmit) return;
    const data = buildPayload(values);
    if (esMuestra && !puedeEnviarMuestra) return;
    if (
      !esMuestra &&
      (!confirmacionValida ||
        (requiereMuestra && muestraEnviada !== JSON.stringify(data)))
    ) return;

    envioEnCurso.current = true;
    try {
      if (esMuestra) {
        setMuestraEnviada(null);
        setConfirmacion("");
        await crearMuestra({ ...data, version: "" });
        setMuestraEnviada(JSON.stringify(data));
        return;
      }

      await crearLote(data);
      form.resetFields();
      setOrganizacion(null);
      setServicio(null);
      setMuestraEnviada(null);
      setConfirmacion("");
      onCancel();
    } catch {
      // La mutación muestra el error; se conservan los datos para reintentar.
    } finally {
      envioEnCurso.current = false;
    }
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
      disabled={isCreating}
      onValuesChange={() => {
        setMuestraEnviada(null);
        setConfirmacion("");
      }}
      initialValues={{
        canal: "email",
        recepcion: dayjs(),
        etiquetas: { Dia: dayjs() },
        archivos: [],
      }}
      onFinish={(values) => onFinish(values)}
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
            label: (
              <>
                {srv.nombre} (<strong>{srv.codigo}</strong>)
              </>
            ),
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
            codigoCliente={organizacion.codigo}
            base={organizacion.base}
            onChange={(values, masks) => {
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
        {requiereMuestra && (
          <Alert
            type={muestraVigente ? "success" : "info"}
            showIcon
            title={muestraVigente
              ? "Muestra enviada correctamente. Ya podés confirmar el envío del lote."
              : "Enviá la muestra con los datos actuales para habilitar el envío del lote."}
            style={{ marginBottom: 12 }}
          />
        )}
        <Form.Item
          label="Confirmación del envío del lote"
          extra={requiereMuestra
            ? servicio?.codigo
              ? <>Escribí exactamente: <strong>{confirmacionEsperada}</strong> (enviar, un espacio y el código del servicio).</>
              : "Seleccioná un servicio para ver el texto de confirmación."
            : "Escribí exactamente: enviar"}
        >
          <Input
            value={confirmacion}
            onChange={(event) => setConfirmacion(event.target.value)}
            disabled={!puedeEnviarLote || isCreating}
            placeholder={requiereMuestra ? "enviar CODIGO_SERVICIO" : "enviar"}
            autoComplete="off"
          />
        </Form.Item>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button
            disabled={isCreating}
            onClick={() => {
              form.resetFields();
              setOrganizacion(null);
              setServicio(null);
              setMuestraEnviada(null);
              setConfirmacion("");
              onCancel();
            }}
          >
            Cancelar
          </Button>

          {puedeEnviarMuestra && (
            <Button
              htmlType="button"
              disabled={!canSubmit || isCreating}
              loading={isPendingMuestra}
              onClick={async () => {
                try {
                  const values = await form.validateFields();
                  await onFinish(values, true);
                } catch {
                  // La validación y la mutación muestran sus propios errores.
                }
              }}
            >
              Enviar muestra
            </Button>
          )}

          <Button
            type="primary"
            htmlType="submit"
            disabled={!puedeEnviarLote || !confirmacionValida || isCreating}
            loading={isPending}
          >
            Crear / enviar lote
          </Button>
        </Space>
      </div>
    </Form>
  );
};
