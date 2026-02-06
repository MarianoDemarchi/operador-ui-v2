ApiError – Manejo Centralizado de Errores y Logging
Objetivo

El objetivo del módulo ApiError es centralizar el manejo de errores provenientes de las llamadas a la API, estandarizar la forma en que se reportan, y facilitar el registro (logging) de:

Errores técnicos

Errores de negocio

Acciones ejecutadas por el usuario

Contexto de la operación (endpoint, método, usuario, permisos)

Esto permite:

Mejor trazabilidad

Menor duplicación de lógica

Mayor consistencia en el manejo de errores

Integración futura con sistemas de auditoría o monitoreo (CloudWatch, Sentry, Datadog, etc.)

Alcance

ApiError se utiliza en conjunto con:

Cliente HTTP (Axios)

Interceptores de request/response

Servicios de API organizados por dominio (un archivo por API)

Estructura General
src/
 ├── api/
 │    ├── client/
 │    │    ├── client.ts
 │    │    ├── interceptors.ts
 │    │    └── ApiError.ts
 │    ├── lotes.api.ts
 │    ├── usuarios.api.ts
 │    └── index.ts
 ├── auth/
 ├── utils/

¿Qué es ApiError?

ApiError es una clase de error personalizada que encapsula toda la información relevante de un error de API.

No representa solo un mensaje, sino un objeto estructurado que contiene:

Código HTTP

Mensaje legible

Detalle técnico

Endpoint afectado

Método HTTP

Usuario que ejecutó la acción

Acción realizada

Definición de ApiError
export class ApiError extends Error {
  status: number;
  code?: string;
  endpoint?: string;
  method?: string;
  user?: string;
  action?: string;
  details?: any;

  constructor({
    message,
    status,
    code,
    endpoint,
    method,
    user,
    action,
    details,
  }: {
    message: string;
    status: number;
    code?: string;
    endpoint?: string;
    method?: string;
    user?: string;
    action?: string;
    details?: any;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.endpoint = endpoint;
    this.method = method;
    this.user = user;
    this.action = action;
    this.details = details;
  }
}

¿Cuándo se crea un ApiError?

Un ApiError se crea principalmente en los siguientes casos:

Error HTTP (4xx / 5xx)

Error de red

Error de autorización / permisos

Error de validación

Error inesperado del backend

Normalmente se instancia dentro del interceptor de respuesta de Axios.

Uso en Interceptores
Interceptor de Response (Axios)
import { ApiError } from "./ApiError";

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    throw new ApiError({
      message: response?.data?.message || "Error en la API",
      status: response?.status || 500,
      code: response?.data?.code,
      endpoint: response?.config?.url,
      method: response?.config?.method,
      user: response?.config?.headers?.["x-user"],
      action: response?.config?.headers?.["x-action"],
      details: response?.data,
    });
  }
);


De esta forma:

Todos los errores llegan a la aplicación con el mismo formato.

El frontend no depende de estructuras inconsistentes del backend.

Integración con Logs de Usuario

ApiError está diseñado para integrarse con un sistema de logging de acciones.

Ejemplo de información logueada:

{
  "user": "jserra@empresa.com",
  "action": "CREAR_LOTE",
  "endpoint": "/operadorp/lotes",
  "method": "POST",
  "status": 403,
  "message": "Usuario sin permisos"
}


Esto permite:

Auditoría

Análisis de fallas por usuario

Trazabilidad de operaciones

Uso desde las APIs por dominio

Ejemplo lotes.api.ts:

import client from "../client/client";

export const LotesApi = {
  getListaLotes: () => {
    return client.get("/operadorp/lotes?estado=todos", {
      headers: {
        "x-action": "LISTAR_LOTES",
      },
    });
  },

  postCreacionLotes: (data: any) => {
    return client.post("/operadorp/lotes", data, {
      headers: {
        "x-action": "CREAR_LOTE",
      },
    });
  },
};


Si ocurre un error:

Axios lanza un ApiError

El componente solo debe manejar un tipo de error

Manejo en Componentes
try {
  await LotesApi.postCreacionLotes(data);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message);
    console.error("Acción:", error.action);
    console.error("Usuario:", error.user);
  } else {
    console.error("Error inesperado", error);
  }
}

Beneficios Clave

Manejo de errores consistente

Código más limpio en componentes

Fácil integración con sistemas de logs

Escalable a permisos, roles y auditoría

Separación clara de responsabilidades

Buenas Prácticas

No manejar errores HTTP directamente en los componentes

Siempre usar ApiError para errores de API

Registrar acciones mediante headers (x-action)

No exponer detalles técnicos al usuario final

Centralizar el logging

Próximos Pasos Recomendados

Enviar logs a backend o servicio externo

Asociar action con permisos

Integrar con sistema de roles

Visualización de logs en dashboard administrativo

Si querés, en el próximo paso puedo:

Adaptar esto a TypeScript estricto

Armar el logger completo (frontend → backend)

Diseñar el modelo de permisos por acción

O convertir esto en una plantilla estándar de proyecto