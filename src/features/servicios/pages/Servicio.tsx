import { useState } from "react";
import QueryErrorResult from "../../feedback/QueryErrorResult";
import { ServiciosHeader } from "../components/ServiciosHeader";
import { ServicioTable } from "../components/ServiciosTable";
import { useServiciosQuery } from "../hooks/useServiciosQuery";
import type { Cliente } from "../models/cliente.model";
import { Space, Card, Skeleton } from "antd";
import { ClienteSelect } from "../components/ServiciosClienteSelect";

export const ListaServicios: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente | undefined>();

  const {
    data,
    isError,
    error,
    isLoading,
    isFetching,
    toggleServicio,

    refetch,
  } = useServiciosQuery(cliente?.base);

  if (isError) {
    return <QueryErrorResult error={error} onRetry={refetch} />;
  }

  return (
    <div style={{ width: "100%", padding: "16px" }}>
      <ServiciosHeader />

      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: "50%" }}>
          <ClienteSelect value={cliente} onChange={setCliente} />
        </Space>
      </Card>
      {isLoading ? (
        <Skeleton active></Skeleton>
      ) : (
        <Space  style={{ width: "70%" ,marginLeft:10 }}>
          <ServicioTable
            onToggle={toggleServicio}
            data={data ?? []}
            isFetching={isFetching}
          />
        </Space>
      )}
    </div>
  );
};
