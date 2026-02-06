import React, { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { ConfigProvider, Spin } from "antd";
import { operadorTheme } from "../theme/theme.operador";

// ------------------- Tipos -------------------
interface PrivateRouteProps {
  mostrarError: (args: {
    titulo: string;
    descripcion: string;
    duracion?: number;
  }) => void;
  signOut: () => Promise<void>;
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  signOut,
}) => {
  const location = useLocation();
  
  // Estados para controlar el flujo de validación
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // ------------------- Función principal de validación -------------------
  async function checkAuth() {
    try {
      // 1. Cargar tokens desde Amplify
      const tokens = await cognitoUserPoolsTokenProvider.authTokenStore.loadTokens();

      if (!tokens?.accessToken || !tokens?.idToken) {
        throw new Error("No hay una sesión activa.");
      }

      const { accessToken, idToken } = tokens;

      // 2. Validar expiración (comparando segundos)
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const expiration = accessToken.payload.exp;

      if (expiration && expiration < nowInSeconds) {
        throw new Error("La sesión ha expirado.");
      }

      // 3. Persistir datos necesarios
      localStorage.setItem("auth_token", idToken.toString());
      const email = typeof idToken.payload.email === "string" ? idToken.payload.email : "";
      localStorage.setItem("usuario", email);

      // 4. Todo OK
      setIsExpired(false);
    } catch (err) {
      console.error("Error de autenticación:", err);
      
      // Limpieza controlada
      await cognitoUserPoolsTokenProvider.authTokenStore.clearTokens();
      localStorage.clear();
      setIsExpired(true);
      
      // Solo ejecutamos signOut si no estamos ya en la raíz para evitar loops
      if (location.pathname !== "/") {
         signOut();
      }
    } finally {
      // 5. Finalizar estado de carga pase lo que pase
      setIsVerifying(false);
    }
  }

  // ------------------- Efecto de validación -------------------
  useEffect(() => {
    // Cada vez que cambie la ruta, verificamos que el usuario siga siendo válido
    checkAuth();
  }, [location.pathname]);

  // ------------------- Renderizado Condicional -------------------

  // PASO A: Mientras se verifica el token (especialmente tras un refresh)
  if (isVerifying) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: operadorTheme.token?.colorBgLayout 
      }}>
        <Spin size="large" tip="Validando credenciales..." />
      </div>
    );
  }

  // PASO B: Si el token expiró o es inválido, redirigimos al Login
  if (isExpired) {
    return <Navigate to="/" replace />;
  }

  // PASO C: Si todo está en orden, aplicamos el tema y mostramos el dashboard
  return (
    <ConfigProvider theme={operadorTheme}>
      {children}
    </ConfigProvider>
  );
};

export default PrivateRoute;