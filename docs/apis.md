# APIs y configuración

## Clientes HTTP

`src/api/client/client.ts` exporta cuatro instancias Axios con timeout `0` (sin límite). Se inicializan a partir de variables Vite.

| Cliente | Variable | Comportamiento actual |
| --- | --- | --- |
| `client` | `VITE_API_BASE_URL` | JSON; agrega Bearer `auth_token`; en 401 limpia localStorage y redirige a `/` |
| `client2` | `VITE_API_BASE_URL_2` | JSON y Bearer; está configurado aunque los adaptadores activos revisados usan otros clientes |
| `client3` | `VITE_API_BASE_URL_PLANET` | Fuerza `multipart/form-data`; no agrega Bearer en su interceptor |
| `client4` | `VITE_API_BASE_URL_NONE` | Sin interceptores registrados; monitoreo utiliza una URL absoluta |

Los valores reales del entorno no se documentan aquí. `.env.example` enumera los nombres; `.env.local` permite configuración local y está ignorado por `*.local`. El `.env` existente no está cubierto por esa regla: no añadir credenciales ni copiar sus valores a commits. Las variables `VITE_*` son públicas en el bundle.

Cognito usa `src/app/config.tsx` y `src/app/amplify.ts`, no estas cuatro variables. El campo `apiGateway.URL` de `config.tsx` no configura las instancias Axios.

Los adaptadores devuelven normalmente la respuesta Axios completa. Los hooks suelen extraer `resp.data`; monitoreo conserva la respuesta y lee `data.data.body`. Mantener el contrato que espera el consumidor.

## Mapa de operaciones

Las rutas y métodos siguientes proceden del frontend. Los query params se resumen; revisar el adaptador y el hook para el payload completo.

| Archivo API | Cliente | Operaciones |
| --- | --- | --- |
| `clientes.api.ts` | `client` | GET `/operador-api/clientes` |
| `servicio.api.ts` | `client` | GET `/operadorp/servicios?base=…`; gestión: GET `/operador-api/servicios?base=…`; PUT `/operador-api/gestion-servicios` con `id_servicio`, `db`, `activo` |
| `lotes.api.ts` | `client` | GET `/operador-api/lotes?estado=todos` |
| `lotes-legacy.ts` | `client` | GET `/operadorp/lotes?estado=todos`, `/operadorp/campos?base=…&servicio=…`, `/operadorp/control?cliente=…&lote=…`, `/operadorp/sumariza?base=…&lote=…` |
| `lotes-legacy.ts` | `client3` | POST `/CrearLote`, `/SendTestEmail`, `/EnvioLote`, `/CancelaLote`, `/DetenerLote` |
| `legacy-files.api.ts` | `client3` | GET `/ListarArchivos`, `/ListarArchivosDescarga` |
| `tareas.api.ts` | `client` / `client3` | GET `/operadorp/lotes?estado=acciones_v2`; POST `/Reenvio` |
| `logs.api.ts` | `client` | GET `/operadorp/logs` con `timelog` y `estado=todos` |
| `monitoreo.ts` | `client4` | GET a URL absoluta de API Gateway declarada en el archivo |
| `emisiones-papel.ts` | `client` | GET `/impresionesecoprod/lotes?estado=creados`, `/operadorp/cabeceras`; DELETE `/impresionesecofrontprod/delete`; POST `/operadorp/porciones` |
| `emisiones-papel.ts` | `client` | GET `/impresionesecoprod/impoperativos`, `/impresionesecofrontprod/informes`, `/impresionesecoprod/telegram` |
| `emisiones-papel.ts` | `client3` | GET `/ListarArchivosPapel/{distribuidora}/{servicio}`; POST `/CrearLotePapel/{servicio}`, `/MovimientoEmision`, `/CancelaLote` |

Algunas solicitudes GET disparan acciones de negocio (control, sumarización, email, informes o Telegram). No asumir que una operación es inocua por usar GET.

## Serialización legacy

Crear lote o muestra usa multipart con un campo `file` cuyo valor es `JSON.stringify(payload)`. No es un archivo binario. Enviar, cancelar y detener serializan un array de lotes en ese mismo campo, incluso para un solo lote.

```ts
const formData = new FormData();
formData.append("file", JSON.stringify(payload));
```

Los nombres exactos importan: `archiv`, `archivoAdjunto`, `id_servicio`, `base`, etc. No convertirlos a camelCase ni sustituir multipart por JSON sin confirmar el contrato. La lista compartida espera `{ listaArchivos: string[], listaAdjuntos: string[] }`. El botón Enviar muestra utiliza `/SendTestEmail` con los archivos de esa lista.

## Errores y permisos

`setupInterceptors` se llama en `main.tsx`. Los interceptores actuales no convierten AxiosError en ApiError. `ApiError.ts` define una clase con contexto (status, code, endpoint, método, usuario y acción); no implica que ese contexto se genere automáticamente ni que haya auditoría integrada.

`auth/permissions.tsx` y `hasPermission.ts` contienen utilidades. Muchos headers `x-action`/`x-permission` están comentados en los adaptadores. Verificar su uso efectivo antes de extender autorización o logging. Los mensajes visibles de mutaciones se centralizan en `features/feedback/ActionFeedback.ts`.
