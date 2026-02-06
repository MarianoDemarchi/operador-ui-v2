// components/clientes/ClienteSelect.tsx
import { Select, Spin } from "antd";
import type { Cliente } from "../models/cliente.model";
import { useClientesQuery } from "../hooks/useClienteQuery";

interface Props {
  value?: Cliente;
  onChange: (cliente?: Cliente) => void;
}

export const ClienteSelect = ({ value, onChange }: Props) => {
  const { data = [], isLoading } = useClientesQuery();

  return (
    <Select
      showSearch
      allowClear
      placeholder="Seleccionar cliente"
      loading={isLoading}
      value={value?.id}
      style={{ width: "100%" }}
      onChange={(id) => {
        const cliente = data.find((c) => c.id === id);
        onChange(cliente);
      }}
      options={data.map((c) => ({
        value: c.id,
        label: c.nombre,
      }))}
      notFoundContent={isLoading ? <Spin size="small" /> : null}
    />
  );
};
