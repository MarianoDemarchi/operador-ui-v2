import { Col, Row, Skeleton } from "antd";
import { LotesLegacyHeader } from "../components/LotesLegacyHeader";
import { LotesLegacyTable } from "../components/LotesLegacyTable";
import { useLotesLegacyActions } from "../hooks/useLotesLegacyActions";
import { useLotesSelection } from "../hooks/useLotesLegacySelections";
import { useLotesQuery } from "../hooks/useLotesQuery";
import { LotesLegacyCrear } from "../components/LotesLegacyCrear";
import { useState } from "react";
import { LotesLegacyActions } from "../components/LotesLegacyActions";
import { LotesLegacyUpload } from "../components/LotesLegacyUpload";

export const ListaLotesLegacy = () => {
  const { data = [], isLoading, isFetching, refetch } = useLotesQuery();
  const selection = useLotesSelection();
  const actions = useLotesLegacyActions();
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
  const [openUploadDrawer, setOpenUploadDrawer] = useState(false);

  const selected = selection.selected[0];


  return (
    <div style={{ width: "100%", padding: "16px" }}>
      <LotesLegacyHeader isFetching={isFetching} onReload={refetch} />

      <Row gutter={[16, 16]}>
        {/* Tabla */}

        {/* Acciones */}
        {isLoading ? (
          <Skeleton active></Skeleton>
        ) : (
          <>
            <Col
            style={{margin:0}}
              xs={24} // móvil: ocupa toda la fila
              md={22} // tablet/desktop: 2/3 del ancho
            >
              <LotesLegacyTable
                isLoading={isLoading}
                isFetching={isFetching}
                data={data}
                selected={selected}
                onSelect={selection.toggle}
              />
            </Col>
            <Col
              xs={24} // móvil: ocupa toda la fila (debajo de la tabla)
              md={1} // desktop: 1/3 del ancho
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: 30,
              }}
            >
              <LotesLegacyActions
                setOpenCreateDrawer={setOpenCreateDrawer}
                setOpenUploadDrawer={setOpenUploadDrawer}
                canEnviar={selection.canEnviar}
                canCancelar={selection.canCancelar}
                canSumarizar={selection.canSumarizar}
                onEnviar={() => selected && actions.enviar.mutate(selected)}
                onCancelar={() => selected && actions.cancelar.mutate(selected)}
                onSumarizar={() =>
                  selected && actions.sumarizar.mutate(selected)
                }
                onControl={() => actions.control.mutate(selected)}
              />
              <LotesLegacyCrear
                open={openCreateDrawer}
                onClose={() => setOpenCreateDrawer(false)}
              />
              <LotesLegacyUpload
                open={openUploadDrawer}
                onClose={() => setOpenUploadDrawer(false)}
              ></LotesLegacyUpload>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};
