import { Col, Row, Skeleton } from "antd";
import { EmisionHeader } from "../components/EmisionHeader";
import { actionFeedback } from "../../feedback/ActionFeedback";
import { useEmisionesQuery } from "../hooks/useEmisionQuery";
import { EmisionesTable } from "../components/EmisionTable";
import { useEmisionActions } from "../hooks/useEmisionActions";
import { useEmisionSelections } from "../hooks/useLotesLegacySelections";
import { EmisionActions } from "../components/EmisionActions";
import { useState } from "react";
import { EmisionDrawerCreate } from "../components/EmisionDrawerCrear";
import { EmisionDrawerPorciones } from "../components/EmisionDrawerPorciones";
import type { Porcion } from "../models/porciones-.model";
import { EmisionDrawerDetalle } from "../components/EmisionDrawerDetalle";
import { EmisionDrawerTelegram } from "../components/EmisionDrawerTelegram";
import { EmisionDrawerInforme } from "../components/EmisionDrawerInforme";

export const ListaEmisionesPapel = () => {
  const { data = [], isLoading, isFetching, refetch } = useEmisionesQuery();
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
  const [openPorcionesDrawer, setOpenPorcionesDrawer] = useState(false);
  const [openDetalleDrawer, setOpenDetalleDrawer] = useState(false);
  const [openTelegramDrawer, setOpenTelegramDrawer] = useState(false);
  const [openInformeDrawer, setOpenInformeDrawer] = useState(false);

  const [dataPorciones, setDataPorciones] = useState<Porcion[]>([]);

  const selection = useEmisionSelections();
  const selected = selection.selected[0];
  const actions = useEmisionActions();

  if (isLoading) {
    actionFeedback.loading("listar");
  }
  if (isFetching) {
    actionFeedback.loading("actualizar");
  }
  return (
    <div style={{ width: "100%", padding: "16px" }}>
      <EmisionHeader isFetching={isFetching} onReload={refetch} />

      {/* Tabla */}

      {/* Acciones */}
      {isLoading ? (
        <Skeleton></Skeleton>
      ) : (
        <Row gutter={[16, 16]}>
          <Col
            xs={24} // móvil: ocupa toda la fila
            md={22} // tablet/desktop: 2/3 del ancho
          >
            <EmisionesTable
              isLoading={isLoading}
              isFetching={isFetching}
              data={data}
              selected={selected}
              onSelect={selection.toggle}
              onEnviarEmail={(emision, cabecera) =>
                actions.enviarEmail.mutate({ emision, cabecera })
              }
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
            <EmisionActions
              setOpenCreateDrawer={setOpenCreateDrawer}
              setOpenPorcionesDrawer={setOpenPorcionesDrawer}
              setOpenDetalleDrawer={setOpenDetalleDrawer}
              setOpenTelegramDrawer={setOpenTelegramDrawer}
              setOpenInformeDrawer={setOpenInformeDrawer}
              onEliminar={() => selected && actions.eliminar.mutate(selected)}
              onMovimiento={() =>
                selected && actions.movimientoArchivos.mutate(selected)
              }
              disabled={selected === undefined ? true : false}
              loadingMovimiento={actions.movimientoArchivos.isPending}
              canEliminar={selection.state.canEliminar}

              // canCancelar={selection.canCancelar}
              // canDetener={selection.canDetener}
              // canSumarizar={selection.canSumarizar}
              // onEnviar={() => selected && actions.enviar.mutate(selected)}
              // onCancelar={() => selected && actions.cancelar.mutate(selected)}
              // onDetener={() => selected && actions.detener.mutate(selected)}
              // onSumarizar={() => selected && actions.sumarizar.mutate(selected)}
            />

            <EmisionDrawerCreate
              open={openCreateDrawer}
              onClose={() => setOpenCreateDrawer(false)}
            ></EmisionDrawerCreate>

            <EmisionDrawerPorciones
              loadingValidacionPorciones={actions.validarPorciones.isPending}
              onSubmit={(payload) =>
                actions.validarPorciones.mutateAsync(payload)
              }
              dataPorciones={dataPorciones}
              setDataPorciones={setDataPorciones}
              open={openPorcionesDrawer}
              onClose={() => setOpenPorcionesDrawer(false)}
            ></EmisionDrawerPorciones>

            <EmisionDrawerDetalle
              open={openDetalleDrawer}
              onClose={() => setOpenDetalleDrawer(false)}
              fila={selected}
            ></EmisionDrawerDetalle>
            <EmisionDrawerTelegram
              onSendMessage={(mensaje) =>
                actions.enviarTelegram.mutate({
                  distribuidora: selected.distribuidora,
                  mensaje,
                  id_emision: selected.id_emision,
                })
              }
              fila={selected}
              open={openTelegramDrawer}
              onClose={() => setOpenTelegramDrawer(false)}
            ></EmisionDrawerTelegram>
            <EmisionDrawerInforme
              open={openInformeDrawer}
              onClose={() => setOpenInformeDrawer(false)}
            ></EmisionDrawerInforme>
          </Col>
        </Row>
      )}
    </div>
  );
};
