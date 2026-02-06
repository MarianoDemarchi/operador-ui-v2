import React, { useEffect, useCallback, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // 👈 Importante: useLocation
import { notification, Spin } from "antd";
import PrivateRoute from "./PrivateRoute";
import { DashboardRoutes } from "./DashboardRoutes";
import "../index.css";
import { I18n } from "@aws-amplify/core";
import { translations } from "@aws-amplify/ui-react";

// 🔹 Login lazy
const Login = lazy(() => import("../features/login/Login"));

// ------------------- Tipos -------------------
interface MostrarErrorArgs {
  titulo: string;
  descripcion: string;
  duracion?: number;
}

interface AuthenticatorUser {
  username: string;
  attributes: Record<string, any>;
}

// ------------------- Componente -------------------
const AppRouter: React.FC = () => {
  const location = useLocation(); // 👈 Obtenemos la ruta actual para el refresh

  useEffect(() => {
    document.title = "Mando Operador";

    I18n.putVocabularies(translations);
    I18n.setLanguage("es");
    I18n.putVocabularies({
      es: {
        "Please confirm your Password": "Por favor confirma tu Contraseña",
      },
    });
  }, []);

  const [api] = notification.useNotification();

  const mostrarError = useCallback(
    ({ titulo, descripcion, duracion }: MostrarErrorArgs) => {
      api.error({
        message: titulo,
        description: descripcion,
        duration: duracion,
      });
    },
    [api],
  );

  return (
    <Suspense
      fallback={
        /* Usamos fullscreen para evitar el warning de antd y centrar el loader */
        <Spin fullscreen tip="Cargando sistema..." size="large" />
      }
    >
      <Routes>
        <Route
          path="/*"
          element={
            <Login>
              {({ user, signOut }: { user: AuthenticatorUser | null; signOut: () => Promise<void> }) => {
                
                // 1. Mientras Amplify carga la sesión inicial, no renderizamos nada (el Suspense o el Spin interno actúan)
                if (!user) return null;

                // 2. Si el usuario está logueado y está EXACTAMENTE en la raíz o login,
                // lo mandamos a la página principal.
                if (location.pathname === "/" || location.pathname === "/login") {
                  return <Navigate to="/generacionPapel" replace />;
                }

                // 3. SI EL USUARIO YA ESTÁ EN UNA RUTA (ej: /lotesV2), 
                // NO REDIRIGIMOS. Dejamos que cargue su contenido.
                return (
                  <PrivateRoute mostrarError={mostrarError} signOut={signOut}>
                    <DashboardRoutes />
                  </PrivateRoute>
                );
              }}
            </Login>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;