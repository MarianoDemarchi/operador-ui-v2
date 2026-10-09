# Mando Operador · operador-ui

Frontend de operación de Mando para gestionar envíos digitales, emisiones de papel, tareas, servicios y monitoreo. Es una SPA en React y TypeScript; los procesos y datos de negocio viven en servicios externos. Este repositorio no contiene el backend.

## Empezar

Requisitos: npm y una versión de Node compatible con Vite instalado. El Vite del lockfile actual requiere Node `20.19+` en la rama 20 o `22.12+` en las ramas posteriores.

```bash
npm ci
cp .env.example .env.local
# Completar las URLs con los valores del entorno autorizado.
npm run dev
```

Si ya existe configuración local, conservarla. Vite muestra la URL y el puerto disponibles al arrancar. El login necesita acceso al Cognito configurado y las pantallas necesitan conectividad a sus APIs. No hay modo offline ni servidor mock configurados.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo con Vite y recarga de cambios |
| `npm run build` | Chequeo TypeScript (`tsc -b`) y compilación a `dist/` |
| `npm run preview` | Vista local del build; no es un servidor de producción |
| `npm run lint` | ESLint sobre el proyecto |
| `git diff --check` | Detectar errores de whitespace en el diff |

No hay script de tests ni suite de pruebas configurada. Para un cambio funcional, combinar build, lint y una comprobación manual del flujo afectado. Distinguir los fallos existentes de los introducidos por el cambio.

## Documentación

- [Guía para agentes](AGENTS.md): dónde empezar y cómo trabajar en este repositorio.
- [Arquitectura](docs/arquitectura.md): arranque, módulos, rutas, autenticación, estado y limitaciones actuales.
- [APIs y configuración](docs/apis.md): clientes HTTP, variables y operaciones por dominio.
- [Lotes legacy y muestras](docs/lotes-legacy.md): formulario compartido, archivos, payloads y verificaciones.
- [Guía de desarrollo](docs/desarrollo.md): cómo implementar cambios y comprobarlos.

La documentación describe el código observado el 9 de octubre de 2026. Los endpoints documentados son los que consume el frontend; no sustituyen un contrato del backend ni confirman su disponibilidad.

## Stack y estructura

React 19, TypeScript 5.9, Vite, React Router 7, Ant Design 6, TanStack React Query 5, Axios y AWS Amplify/Cognito. Consultar `package.json` para rangos y `package-lock.json` para versiones resueltas.

```text
src/
  app/          Arranque, configuración Amplify y App
  api/          Adaptadores HTTP por dominio y clientes Axios
  auth/         Utilidades de sesión y permisos
  context/      Estado compartido de interfaz
  routes/       Login, protección de sesión y rutas del dashboard
  layout/       Layout, menú, sidebar y header
  features/     Páginas, componentes, hooks y modelos por funcionalidad
  theme/        Tema de Ant Design
  assets/       Logos e imágenes
  types/        Declaraciones adicionales de tipos
```

La interfaz y los textos de negocio están en español. Hay módulos con nombres históricos y directorios `page/` y `pages/`; seguir la estructura real del módulo al editarlo.

## Configuración y despliegue

Las URLs HTTP se inyectan con variables `VITE_*`; ver [.env.example](.env.example) y [APIs](docs/apis.md). Vite las incorpora al bundle, por lo que no deben contener secretos. Cognito se configura en `src/app/config.tsx` y se inicializa en `src/app/amplify.ts`.

El build genera `dist/`. El hosting debe servir `index.html` como fallback para rutas de la SPA, por ejemplo `/lotes`, y permitir acceso a las APIs y a Cognito. No hay pipeline de despliegue definido en los archivos revisados. Vite separa chunks `antd`, `query` y `vendor`; pueden aparecer avisos por el tamaño de los bundles.
