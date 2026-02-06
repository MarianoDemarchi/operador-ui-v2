import type { ColumnsType } from "antd/es/table";
import type { Tarea } from "../models/tarea.model";

export const tareaColumns: ColumnsType<Tarea> = [
  {
    width: 100,
    title: "Cliente",
    dataIndex: "nombre",
    key: "nombre",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
  {
    width: 150,

    title: "Servicio",
    dataIndex: "descripcion",
    key: "descripcion",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
  {
    width: 100,

    title: "ID lote",
    dataIndex: "id_lote",
    key: "id_lote",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
  {
    title: "Nombre",
    dataIndex: "l_nombre",
    key: "l_nombre",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
  {
    title: "Enviado",
    dataIndex: "ts_enviado",
    key: "ts_enviado",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
  {
    title: "Accion Pendiente",
    dataIndex: "accion_pendiente",
    key: "accion_pendiente",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
  {
    title: "Detalle",
    dataIndex: "detalle",
    key: "detalle",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
  {
    width: 120,
    title: "Tiempo Excedido",
    dataIndex: "tiempo_excedido",
    key: "tiempo_excedido",
    render: (text, record) =>
      record.tiempo_excedido.charAt(0) === "-" ? (
        <span>{text}</span>
      ) : (
        <span style={{ color: "red" }}>{text}</span>
      ),
  },
];
