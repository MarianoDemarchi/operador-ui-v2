import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import PageNotFound from "../pages/PageNotFound";

const ListaLotesV2 = lazy(() =>
  import("../features/lotes/pages/Lotes").then((m) => ({
    default: m.ListaLotesV2,
  })),
);

const Tareas = lazy(() =>
  import("../features/tareas/page/Tareas").then((m) => ({
    default: m.Tareas,
  })),
);

const ListaServicios = lazy(() =>
  import("../features/servicios/pages/Servicio").then((m) => ({
    default: m.ListaServicios,
  })),
);

const ListaEmisionesPapel = lazy(() =>
  import("../features/gestion-impresion/pages/Emisiones").then((m) => ({
    default: m.ListaEmisionesPapel,
  })),
);
const ListaLotesLegacy = lazy(() =>
  import("../features/lotes-legacy/pages/LotesLegacy").then((m) => ({
    default: m.ListaLotesLegacy,
  })),
);
const ListaPortales = lazy(() =>
  import("../features/portales/page/Portales").then((m) => ({
    default: m.ListaPortales,
  })),
);

// ... tus imports lazy se mantienen igual ...

export const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* CAMBIO CLAVE 1: Usamos 'index' para la ruta base del dashboard.
           Si el usuario entra a la base del dashboard, lo mandamos a generacionPapel.
        */}
        <Route index element={<Navigate to="generacionPapel" replace />} />

        {/* CAMBIO CLAVE 2: Las rutas deben ser relativas al padre. 
           Asegúrate de que en AppRouter estés usando path="/*"
        */}
        <Route path="lotes" element={<ListaLotesLegacy />} />
        <Route path="lotesV2" element={<ListaLotesV2 />} />
        <Route path="tareas" element={<Tareas />} />
        <Route path="servicios/gestion" element={<ListaServicios />} />
        <Route path="generacionPapel" element={<ListaEmisionesPapel />} />
        <Route path="portales" element={<ListaPortales />} />
      </Route>

      {/* 404 para cualquier cosa dentro del dashboard que no coincida */}
       <Route path="*" element={<PageNotFound />} /> 
    </Routes>
  );
};