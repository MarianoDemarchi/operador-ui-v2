# Lotes legacy y muestras

## Puntos de entrada

La ruta `/lotes` carga `features/lotes-legacy/pages/LotesLegacy.tsx`. La página combina el listado (`useLotesQuery`), selección (`useLotesSelection`), mutaciones (`useLotesLegacyActions`) y botones (`LotesLegacyActions`).

«Crear lote» abre un único drawer `LotesLegacyCrear` con `LoteForm` en `LotesLegacyCrearFormulario.tsx`. Dentro del formulario, «Crear / enviar lote» y «Enviar muestra» comparten campos, validación y archivos; cada botón elige su endpoint de creación. No hay un drawer independiente de muestras. «Enviar muestra» solo aparece al seleccionar la organización con código `ACSA` y un servicio. El envío comprueba también esa condición antes de llamar al endpoint.

| Modo | Lista de archivos | Creación | Caché de archivos |
| --- | --- | --- | --- |
| Crear / enviar lote | GET `/ListarArchivos` | POST `/CrearLote` | `["legacy-files"]` |
| Enviar muestra | GET `/ListarArchivos` | POST `/CrearMuestra` | `["legacy-files"]` |

El botón «Cargar» abre `LotesLegacyUpload` y `LoteCargarForm`, un flujo auxiliar diferente; no es el formulario de creación normal/muestra. Actualmente no tiene `onSubmit` conectado desde el drawer.

## Carga y filtrado

1. `useClientesQuery` obtiene organizaciones. Al elegir una, el formulario conserva el objeto para acceder a `base` y `codigo`.
2. `useServiciosQuery(organizacion?.base)` obtiene servicios. El objeto seleccionado aporta el código del servicio.
3. `DynamicFields` consulta campos dinámicos por servicio/base y devuelve etiquetas y máscaras.
4. `LegacyFilesTable` muestra los archivos compartidos por ambos botones.
5. `useLegacyFiles()` consulta `/ListarArchivos` con la key `["legacy-files"]`. Espera `listaArchivos` y `listaAdjuntos` como arrays de nombres.
6. `useFilteredLegacyFiles` aplica las máscaras sobre los nombres. Convierte valores JSON de organización/servicio a sus códigos y contiene reglas específicas para SMS y servicios ECOG.
7. La tabla entrega todos los archivos filtrados al estado `archivos` y todos los adjuntos al estado `archivosAdjuntos`; no es un selector manual de archivos ni un upload del navegador.

El hook de filtrado recibe `filtros`, pero actualmente basa el filtrado en `mascara`. No eliminar las reglas por servicio sin revisar ejemplos reales de nombres.

## Datos enviados

`onFinish` genera un objeto con:

- `version` y `nombre`: strings vacíos en este formulario.
- `etiquetas`: valores de campos dinámicos; los Dayjs se formatean como `DD-MM-YYYY`.
- `recepcion`: fecha elegida menos tres horas, formateada como `YYYY-MM-DD`.
- `diaEtiqueta`: el mismo valor de `recepcion`.
- `id_servicio`, `id_cliente`, `base`, `cod_cliente`, `cod_servicio`: selección de organización/servicio.
- `canal`: primera letra del valor (`email` → `e`, `sms` → `s`).
- `archiv`: archivos filtrados del servidor; `archivoAdjunto`: adjuntos recibidos.
- `mascara`: concatenación con `*`; sin valores se usa `***`; para `FDENSU` se agrega `;*legajo*`.

La resta de tres horas es el comportamiento actual, no una conversión universal de zona horaria. No cambiarla sin confirmar el significado de recepción en backend.

`CrearLotePayload` declara `archiv: File[]`, mientras la lista y el flujo real trabajan con nombres `string[]` y estado `any[]`. Tener en cuenta esta discrepancia al tipar el formulario; no asumir que se envían bytes de archivos.

`useCreateLoteLegacy` y `useCreateLoteLegacyMuestra` construyen el multipart con `file=JSON.stringify(payload)` y usan feedback «crear». Ambas mutaciones invalidan `["lotes-legacy"]` al completar.

## Validación y cierre

La disponibilidad de submit depende de organización, servicio, recepción, cantidad de archivos mayor que cero y valores de etiquetas completos. El formulario ejecuta sus reglas Ant Design al enviar. Durante la creación se deshabilitan submit y cancelar y se muestra loading.

Después de una creación exitosa, limpia campos, organización y servicio y cierra el drawer. La limpieza está después del `await`: un rechazo de la mutación no debe ejecutar ese cierre exitoso.

Las acciones sobre lotes existentes usan selección de un solo lote, reglas por `estado` y mutaciones distintas de las de creación. Ver `useLotesLegacySelections.ts` y `useLotesLegacyActions.ts` antes de cambiar disponibilidad o payloads.

## Verificación manual de cambios

- Abrir «Crear lote»: comprobar GET `/ListarArchivos`, campos dinámicos, máscaras y listado.
- Comprobar que «Enviar muestra» aparece dentro de «Crear lote» y utiliza la misma lista de archivos.
- Con datos autorizados de prueba, comprobar POST `/CrearLote` o `/CrearMuestra` según el botón y el campo multipart `file`.
- Verificar que campos incompletos bloquean submit y que la espera bloquea acciones duplicadas.
- Verificar feedback, cierre y actualización del listado tras éxito; ante error, conservar el formulario.
- Confirmar en backend el resultado de `/CrearMuestra`. El build por sí solo no verifica endpoints ni procesos de creación.
