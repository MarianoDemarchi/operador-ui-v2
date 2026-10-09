# Desarrollo y mantenimiento

## Antes de editar

Leer `AGENTS.md`, revisar `git status --short` y localizar el dominio con `rg`. Los cambios locales existentes pueden pertenecer al usuario. No descartarlos ni reconstruir archivos desde HEAD para resolver una tarea.

Leer la página, sus hooks, el adaptador API y los modelos antes de modificar un flujo. Hay integración de backend legacy: los nombres de campos, estados, máscaras y formatos de fechas forman parte del comportamiento consumido.

## Implementar un endpoint en el frontend

1. Identificar método, ruta, cliente y contrato con ejemplos de request/response. Si el backend no está en este repositorio, el trabajo consiste en consumirlo.
2. Agregar o reutilizar una función en `src/api/`, manteniendo el cliente correspondiente. Revisar sus interceptores.
3. Definir el modelo junto al feature y adaptar `resp.data` en el hook cuando corresponda.
4. Usar `useQuery` para lectura o `useMutation` para una acción. Elegir una key que distinga recursos y parámetros; invalidar el listado afectado después del éxito.
5. Conectar el componente, validación, loading, errores y cierre. El drawer de creación incluye «Crear / enviar lote» y «Enviar muestra», que comparten formulario y lista de archivos.
6. Actualizar los documentos de API y flujo si cambia el contrato o la navegación.

Una llamada Axios resuelta no demuestra por sí misma éxito de negocio; revisar si el contrato expresa errores dentro de una respuesta HTTP exitosa antes de incorporar ese tratamiento.

## Agregar una pantalla

Crear o ampliar `features/<dominio>/`, reutilizar Ant Design y el tema. Registrar el componente lazy en `routes/DashboardRoutes.tsx` y su acceso en `layout/menu.data.tsx` si debe figurar en el menú. Revisar refresh y acceso directo a la ruta; el servidor del hosting debe aplicar fallback de SPA.

Separar estado remoto de estado de interfaz: React Query para datos del servidor; estado local, Form y UIContext para selección, campos y paneles. Agregar parámetros relevantes a las query keys; no copiar una key genérica de otra pantalla.

## Validación

```bash
npm run build
npm run lint
git diff --check
```

`build` ejecuta TypeScript estricto y Vite; detecta errores de tipos, imports y compilación. ESLint incluye reglas de hooks, React Refresh y TypeScript. No hay suite de tests automatizada configurada. Registrar si un fallo ya existía y evitar convertir una tarea enfocada en una limpieza global.

Para documentación sin cambios funcionales, verificar enlaces y rutas contra el árbol y las afirmaciones contra los archivos fuente. No hace falta repetir el build por cambiar Markdown.

La verificación manual debe cubrir el flujo afectado: navegación, carga, vacíos/errores, validación, estado pendiente y éxito. Usar un entorno autorizado de prueba para operaciones que crean, envían, cancelan o modifican datos. Algunos GET también disparan acciones; ver `docs/apis.md`.

## Diagnóstico rápido

| Síntoma | Revisar |
| --- | --- |
| Pantalla redirige al login | `PrivateRoute`, tokens de Cognito y respuestas 401 de clientes JSON |
| Endpoint apunta a un host inesperado | Variables `VITE_*`, instancia Axios y URLs absolutas |
| Cambio de `.env` no se refleja | Reiniciar Vite; en hosting, reconstruir el bundle |
| Datos de otra pantalla | Query keys; colisiones documentadas en arquitectura |
| No aparecen archivos | Respuesta `listaArchivos`, códigos y máscaras del filtrado |
| Crear no se habilita | Organización, servicio, recepción, etiquetas y cantidad de archivos |
| Error de payload legacy | Campo multipart `file`, JSON, nombres exactos y objeto versus array |
| Drawer auxiliar cierra sin cargar | `LotesLegacyUpload` actualmente no conecta `onSubmit` |
| Build informa chunks grandes | Configuración manual de chunks; es un aviso distinto de un fallo de compilación |

## Mantener esta documentación

Actualizar el mapa de rutas si se agrega una pantalla, la tabla de clientes si cambia configuración, y los flujos si cambian endpoints o serialización. Describir por separado implementación actual y propuestas futuras. No documentar credenciales ni datos personales de solicitudes reales. Al entregar un cambio, indicar archivos relevantes, comprobaciones y límites de la validación real.
