# Arquitectura

## Arranque y autenticación

1. `index.html` carga `src/app/main.tsx`.
2. `main.tsx` importa `app/amplify.ts`, registra los interceptores y crea el `QueryClient`.
3. React monta `StrictMode → BrowserRouter → QueryClientProvider → UIProvider → App`.
4. `App` renderiza `AppRouter`; la pantalla `Login` se carga con `lazy` y usa Amplify Authenticator.
5. Con usuario autenticado, `/` y `/login` redirigen a `/generacionPapel`. Otras rutas se conservan.
6. `PrivateRoute` carga los tokens de Cognito, verifica la expiración del access token y guarda el ID token como `auth_token` y el email como `usuario` en localStorage.
7. Si falla la sesión, limpia tokens y localStorage y redirige al inicio. La comprobación se ejecuta al cambiar la ruta.
8. `PrivateRoute` aplica `ConfigProvider` con el tema de operador. `DashboardRoutes` monta `AppLayout` y las páginas.

`src/context/AuthContext.tsx` está vacío en el estado revisado: no hay un AuthProvider montado. Las utilidades de `src/auth/` y `PublicRoute` no sustituyen el flujo activo descrito. Los clientes JSON toman el token desde localStorage; ver [APIs](apis.md).

## Rutas y dominios

| Ruta | Módulo | Responsabilidad |
| --- | --- | --- |
| `/lotes` | `features/lotes-legacy` | Crear lotes normales/muestra, ver archivos y ejecutar acciones de envíos digitales |
| `/lotesV2` | `features/lotes` | Listado de lotes V2 y archivos |
| `/tareas` | `features/tareas` | Listar tareas y generar reenvíos |
| `/servicios/gestion` | `features/servicios` | Seleccionar cliente/base y activar o desactivar servicios |
| `/generacionPapel` | `features/gestion-impresion` | Emisiones, cabeceras, porciones, informes, email, Telegram y movimiento de archivos |
| `/portales` | `features/portales` | Accesos a portales externos |
| `/monitoreo` | `features/monitoreo` | Anomalías de lotes y dashboards embebidos |

Las páginas del dashboard son lazy. Rutas no reconocidas muestran `PageNotFound`. El menú se declara por separado en `layout/menu.data.tsx`; `menu.mapper.tsx` lo convierte a items Ant Design con la dirección como key. Agregar una pantalla navegable requiere revisar rutas y menú.

`features/logs` no tiene una ruta propia en `DashboardRoutes`: se integra en el layout. `UIContext` mantiene `showLogs`, y `useLogsQuery` habilita consultas cuando el panel está abierto y refresca cada 300000 ms. Conserva en un ref el último timestamp recibido para las siguientes solicitudes.

## Organización de código y datos

El patrón habitual es `página → componentes + hooks → API Axios`. Los modelos de cada dominio están junto al feature; los adaptadores HTTP viven en `src/api/`. Hay excepciones como monitoreo, que declara `useQuery` dentro de la página.

- React Query guarda datos del servidor y ejecuta mutaciones. El estado local y los formularios Ant Design controlan selecciones, drawers, campos y filtros.
- El QueryClient evita reintentar un `ApiError` con status 403; para otros errores permite un reintento. Los interceptores actuales no normalizan todos los errores a esa clase.
- Las mutaciones suelen usar `actionFeedback.loading/success/error` e invalidar el listado correspondiente.
- Servicios y clientes se reutilizan entre formularios de varios dominios. `base` identifica el contexto de datos del cliente y debe acompañar las consultas correspondientes.
- Las emisiones transforman JSON guardado en strings (`cabeceras`, `envia_telegram`) y calculan estados de UI en `useEmisionQuery.ts`.
- Monitoreo refresca cada 30000 ms y parsea dos veces `data.body`; ver el componente antes de cambiar su contrato.

## Claves de caché relevantes

| Datos | Query key actual |
| --- | --- |
| Lotes legacy | `["lotes-legacy"]` |
| Archivos del formulario | `["legacy-files"]` |
| Archivos auxiliares | `["legacy-files-upload"]` |
| Campos legacy | `["legacy-dynamic-fields", servicioId, base]` |
| Clientes | `["clientes"]` |
| Servicios | `["servicios", base]` |
| Emisiones / cabeceras | `["emisiones"]` / `["cabeceras"]` |
| Archivos de emisión | `["controles-emision", distribuidora, servicio]` |
| Tareas / logs | `["tarea"]` / `["logs"]` |
| Lotes V2 y monitoreo | Ambos usan `["lotes"]` actualmente |

## Limitaciones observadas

Estos puntos describen el código actual, no comportamientos deseados ni correcciones realizadas:

- Lotes V2 y monitoreo comparten una key aunque devuelven estructuras diferentes; puede haber contaminación de caché al navegar.
- Los hooks de servicios normal y gestión comparten `["servicios", base]` aunque consumen endpoints diferentes.
- `interceptors.ts` registra dos interceptores de respuesta en `client2`, ninguno de respuesta en `client3`, y no configura `client4`.
- `ApiError` existe, pero los interceptores rechazan los errores Axios originales. El README del cliente se ajustó para reflejarlo.
- Hay utilidades de permisos y headers de acciones comentados; no asumir autorización completa por UI. Revisar cada flujo y el backend.
- La selección legacy habilita acciones según strings de estado y tiene una excepción de cancelación por email en `useLotesLegacySelections.ts`.
- El drawer «Cargar archivo auxiliar» no pasa `onSubmit` al formulario: actualmente no conecta una mutación de carga. Su tabla lista archivos del servidor.
- No hay suite de tests ni pipeline de despliegue definidos en los archivos revisados; existen usos de `any` y efectos cuyo lint debe evaluarse antes de asumir que pasa.

No resolver estos puntos incidentalmente al implementar otra funcionalidad. Revisar el alcance y documentar cualquier comportamiento afectado.
