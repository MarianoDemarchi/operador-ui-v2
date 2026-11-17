# Guía para agentes

Aplica a todo el repositorio. Leer esta guía y la documentación del área antes de modificar código.

## Contexto y lectura inicial

- Este repositorio es el frontend SPA de Mando Operador; no contiene implementación de endpoints backend.
- Leer `README.md`, `docs/arquitectura.md` y `docs/desarrollo.md`.
- Para HTTP y configuración: `docs/apis.md` y `src/api/client/`.
- Para envíos legacy o muestras: `docs/lotes-legacy.md`.
- El código es la referencia del comportamiento actual; actualizar la documentación si cambia.

## Dónde trabajar

- `src/app/main.tsx`: entrada, providers, interceptores y QueryClient.
- `src/routes/DashboardRoutes.tsx`: rutas; `src/layout/menu.data.tsx`: navegación.
- `src/features/<dominio>/`: páginas, componentes, hooks y modelos.
- `src/api/<dominio>.ts`: llamadas HTTP; reutilizar el cliente adecuado.
- `src/features/feedback/ActionFeedback.ts`: mensajes de mutaciones.
- `src/theme/theme.operador.ts`: tema de Ant Design.

## Criterios al cambiar código

- Revisar `git status` y conservar los cambios existentes del usuario.
- Mantener textos de interfaz en español y componentes/hooks del dominio afectado.
- Reutilizar formularios y componentes compartidos; no duplicar el formulario de lotes para muestras.
- El formulario usa `/ListarArchivos`; «Crear / enviar lote» envía a `/CrearLote` y «Enviar muestra» a `/SendTestEmail`.
- Mantener cachés separadas para listas distintas; revisar query keys e invalidaciones.
- Respetar la serialización legacy: `FormData` con campo `file` que contiene JSON.
- No interpretar `archiv` como un upload binario sin revisar su uso: el formulario envía nombres de archivos disponibles en el servidor.
- Revisar los interceptores antes de cambiar headers, autenticación o cliente HTTP.
- No asumir que permisos, `ApiError` o formularios incompletos están integrados; consultar las limitaciones documentadas.
- No publicar tokens, credenciales ni valores locales de `.env` en código, documentación o salidas.
- Mantener los cambios enfocados; documentar problemas ajenos al alcance sin refactorizarlos automáticamente.

## Validación y entrega

- Para cambios de código: `npm run build`, `npm run lint` y comprobación manual pertinente.
- No existe `npm test`; no afirmar que hay cobertura automatizada.
- Para documentación: verificar rutas, enlaces, comandos y afirmaciones contra el código; `git diff --check`.
- Reportar qué se cambió, qué se comprobó y qué depende de acceso real al backend.
