import { Table, Tag } from "antd";
import type { Lote } from "../models/lote.model";
import React, { useCallback, useMemo, useState } from "react";
import { LoteArchivosTable } from "./LotesArchivosTable";
import type { ColumnsType } from "antd/es/table";
import type { Archivo } from "../models/archivo.model";
import { useUI } from "../../../context/UIContext";
import "../../../table_transicion.css";

const normalizeArchivos = (archivos?: string | Archivo[]): Archivo[] => {
  if (!archivos) return [];
  if (Array.isArray(archivos)) return archivos;

  try {
    const parsed = JSON.parse(archivos);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const LotesTable: React.FC<{ data: Lote[]; isFetching: boolean }> =
  React.memo(({ data, isFetching }) => {
    const { showLogs } = useUI();
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

    const renderEstado = useCallback((estado: string) => {
      const map: Record<string, string> = {
        "Enviado OK": "green",
        "Preparado OK": "blue",
        "Preparado ERROR": "red",
        Preparando: "orange",
      };
      return <Tag color={map[estado] ?? "default"}>{estado}</Tag>;
    }, []);

    const columns: ColumnsType<Lote> = useMemo(
      () => [
        {
          title: "ID Lote",
          dataIndex: "id_lote",
          align: "center",
          width: 90,
          ellipsis: { showTitle: false },
          render: (v) => <span title={String(v)}>{v}</span>,
        },
        { title: "Cliente", dataIndex: "nombre", align: "center" },
        { title: "Nombre", dataIndex: "l_nombre", ellipsis: true },
        {
          title: "Estado",
          dataIndex: "estado",
          align: "center",
          render: renderEstado,
        },
        { title: "Preparado", dataIndex: "ts_preparado", align: "center" },
        { title: "Mensajes", dataIndex: "mensajes", align: "center" },
        { title: "Entregados", dataIndex: "entregados", align: "center" },
        { title: "Rebotados", dataIndex: "rebotados", align: "center" },
      ],
      [renderEstado],
    );

    const expandedRowRender = useCallback(
      (record: Lote) => (
        <LoteArchivosTable archivos={normalizeArchivos(record.archivos)} />
      ),
      [],
    );

    return (
      <div
        className={`table-container ${showLogs ? "logs-open" : "logs-closed"}`}
      >
        <Table<Lote>
          rowKey="id_lote"
          size="small"
          pagination={false}
          sticky
        scroll={{ y: !showLogs ? 700 : 400, x: "hidden" }}
          loading={isFetching}
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowKeys,
            onExpand: (expanded, record) => {
              setExpandedRowKeys((prev) =>
                expanded
                  ? [...prev, record.id_lote]
                  : prev.filter((k) => k !== record.id_lote),
              );
            },
            expandedRowRender,
          }}
        />
      </div>
    );
  });
