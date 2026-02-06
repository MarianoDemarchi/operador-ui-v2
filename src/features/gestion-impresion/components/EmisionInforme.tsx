import {
  Button,
  DatePicker,
  Input,
  Select,
  Row,
  Col,
  Form,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import type { EmisionFormValues } from "../models/emision.send,informe";
import { useEmisionActions } from "../hooks/useEmisionActions";
import { actionFeedback } from "../../feedback/ActionFeedback";


interface Props {
  onCancel: () => void;
}

export const EmisionInforme: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm<EmisionFormValues>();

  const { enviarInforme } = useEmisionActions();

  const handleSubmitInforme = async (payloadInforme: EmisionFormValues) => {
    return enviarInforme.mutateAsync({
      distribuidora: payloadInforme.distribuidora ?? "",
      fecha: dayjs(payloadInforme.fecha).format("YYYY-MM-DD") ?? "",
      informe: payloadInforme.informe ?? "",
    });
  };

  const onFinish = async (values: any) => {
    try {
      await handleSubmitInforme(values);
      form.resetFields();
      onCancel();
    } catch (error: any) {
      actionFeedback.error("informe");
      message.error(error.message || "Ocurrió un error inesperado");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ informe: "seguimiento" }}
      onFinish={onFinish}
    >
      <Row gutter={[32, 32]} style={{ marginTop: 24 }} justify="space-around">
        <Col xs={24} md={12} lg={24}>
          <Form.Item
            name="fecha"
            label="Fecha"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12} lg={24}>
          <Form.Item
            name="distribuidora"
            label="Distribuidora"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <Select style={{ width: "100%" }} placeholder="Seleccione">
              <Select.Option value="CTR">Centro</Select.Option>
              <Select.Option value="CUY">Cuyo</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12} lg={24}>
          <Form.Item name="informe" label="Tipo Informe">
            <Input disabled style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 52 }} justify="space-around">
        <Col xs={24} md={12} lg={24}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button
              loading={enviarInforme.isPending}
              onClick={() => {
                const values = form.getFieldsValue();
                console.log(values);
              }}
              type="primary"
              htmlType="submit"
            >
              Generar
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};
