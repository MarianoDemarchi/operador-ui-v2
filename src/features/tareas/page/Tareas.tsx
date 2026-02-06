import React from "react";
import { Row, Col, Skeleton } from "antd";
import QueryErrorResult from "../../feedback/QueryErrorResult";
import { TareasAcciones } from "../components/TareasAcciones";
import { TareaHeader } from "../components/TareasHeader";
import { TareaTable } from "../components/TareasTable";
import { useTareaQuery } from "../hooks/useTareaQuery";
import { useTareaActions } from "../hooks/useTareaGeneraReenvio";
import { useTareaSelections } from "../hooks/useTareaSelections";

export const Tareas: React.FC = () => {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useTareaQuery();
  const actions = useTareaActions();

  const selection = useTareaSelections();
  const selected = selection.selected[0];

  if (isError) {
    return <QueryErrorResult error={error} onRetry={refetch} />;
  }

  return (
    // Contenedor principal full-width
    <div style={{ width: "100%", padding: "16px" }}>
      <TareaHeader onReload={refetch} />
      {isLoading ? (
        <Skeleton></Skeleton>
      ) : (
        <Row gutter={[16, 16]}>
          {/* Tabla */}
          <Col
            xs={24} // móvil: ocupa toda la fila
            md={21} // tablet/desktop: 2/3 del ancho
          >
            <TareaTable
              onSelect={selection.toggle}
              data={data ?? []}
              loading={isLoading}
              isFetching={isFetching}
            />
          </Col>

          {/* Acciones */}
          <Col
            xs={24} // móvil: ocupa toda la fila (debajo de la tabla)
            md={1} // desktop: 1/3 del ancho
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <TareasAcciones
              canReenvio={selection.canReenvio}
              onEnviar={() => actions.reenvio.mutate(selected)}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};
