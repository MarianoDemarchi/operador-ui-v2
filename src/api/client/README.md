# Cliente HTTP

La descripción completa de clientes y endpoints está en [docs/apis.md](../../../docs/apis.md).

- `client.ts` crea `client`, `client2`, `client3` y `client4` con variables Vite y timeout sin límite.
- `interceptors.ts` configura JSON/Bearer y redirección en 401 para los clientes JSON; `client3` fuerza multipart y `client4` no tiene interceptores registrados.
- `setupInterceptors()` se invoca desde `src/app/main.tsx`.
- `ApiError.ts` define una clase de error con contexto, pero los interceptores actuales **no** convierten los errores Axios a esa clase.
- `storage.ts` construye headers desde `idToken` en localStorage; los interceptores activos leen `auth_token`, por lo que no debe asumirse que usan esta utilidad.

Hay dos registros de interceptor de respuesta sobre `client2` y ninguno de respuesta sobre `client3`. Esto describe el estado actual; no presupone una política uniforme para todos los clientes.

Los headers de auditoría, la normalización de errores y el envío a servicios de logging no están integrados por esta capa. Revisar el código antes de basar un flujo nuevo en esos mecanismos.
