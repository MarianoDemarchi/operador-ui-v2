# Lotes legacy y muestras

## Puntos de entrada

La ruta `/lotes` carga `features/lotes-legacy/pages/LotesLegacy.tsx`. La página combina el listado (`useLotesQuery`), selección (`useLotesSelection`), mutaciones (`useLotesLegacyActions`) y botones (`LotesLegacyActions`).

«Crear lote» abre un único drawer `LotesLegacyCrear` con `LoteForm` en `LotesLegacyCrearFormulario.tsx`. Dentro del formulario, «Crear / enviar lote» y «Enviar muestra» comparten campos, validación y archivos; cada botón elige su endpoint de creación. No hay un drawer independiente de muestras. «Enviar muestra» solo aparece al seleccionar la organización con código `ACSA` y un servicio. El envío comprueba también esa condición antes de llamar al endpoint.

| Modo | Lista de archivos | Creación | Caché de archivos |
| --- | --- | --- | --- |
| Crear / enviar lote | GET `/ListarArchivos` | POST `/CrearLote` | `["legacy-files"]` |
| Enviar muestra | GET `/ListarArchivos` | POST `/SendTestEmail` | `["legacy-files"]` |

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

- `version`: `"v3"` únicamente para el lote productivo (`/CrearLote`) si la organización tiene código `ACSA` y `window.location.hostname` es exactamente `localhost` (cualquier puerto). La muestra (`/SendTestEmail`) siempre envía string vacío, igual que los demás clientes y hosts. Se incluye dentro del JSON del campo multipart `file`.
- `nombre`: string vacío en este formulario.
- `etiquetas`: valores de campos dinámicos; los Dayjs se formatean como `DD-MM-YYYY`.
  Para ACSA, la etiqueta `Periodo` (también `Período`, sin distinguir mayúsculas) se envía con `/` en lugar de `-`, por ejemplo `10/2026`. El período editable de ACSA utiliza `Input` en lugar de `AutoComplete` para evitar que el texto de búsqueda muestre valores rechazados. Se identifica por nombre interno o etiqueta visible. El campo bloquea guiones al escribir, ingresar texto o pegar, excluye opciones con guiones y muestra una indicación para usar `/`. La validación también bloquea valores inválidos cargados por programa. Se aplica a muestra y lote; los demás campos, clientes y máscaras conservan su formato.
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

Para ACSA, primero se debe enviar una muestra con éxito. La muestra conserva todos los campos y el drawer abierto; se guarda una copia serializada del payload enviado. El envío del lote se habilita solo si el payload actual coincide con esa muestra. Cambiar un campo invalida la muestra y borra la confirmación; cambiar los archivos o máscaras también impide usar una muestra de otro payload. Reintentar una muestra elimina la habilitación anterior hasta que la nueva solicitud termine con éxito.

Para ACSA (Aguas Cordobesas), el operador debe escribir exactamente `enviar CODIGO_SERVICIO`, con un espacio y el código del servicio seleccionado, para habilitar «Crear / enviar lote». Por ejemplo, si el código es `FACT`, debe escribir `enviar FACT`. Debajo del campo se muestra el texto exacto requerido. Los demás clientes mantienen la confirmación `enviar`. Esta confirmación se verifica tanto en el botón como en el handler; también se aplica a los clientes que no requieren muestra. La confirmación no se incluye en el payload. El envío sigue usando `/CrearLote`, sin agregar una llamada a `/EnvioLote`.

Solo después de crear el lote con éxito se limpian campos, organización, servicio, muestra y confirmación y se cierra el drawer. Los errores conservan los datos para reintentar. Un bloqueo sincrónico evita solicitudes duplicadas y el formulario se deshabilita durante las mutaciones.

Las acciones sobre lotes existentes usan selección de un solo lote, reglas por `estado` y mutaciones distintas de las de creación. Ver `useLotesLegacySelections.ts` y `useLotesLegacyActions.ts` antes de cambiar disponibilidad o payloads.

## Verificación manual de cambios

- Abrir «Crear lote»: comprobar GET `/ListarArchivos`, campos dinámicos, máscaras y listado.
- Comprobar que «Enviar muestra» aparece dentro de «Crear lote» y utiliza la misma lista de archivos.
- Con datos autorizados de prueba, comprobar POST `/CrearLote` o `/SendTestEmail` según el botón y el campo multipart `file`.
- Verificar que campos incompletos bloquean submit y que la espera bloquea acciones duplicadas.
- En ACSA, comprobar que el lote está bloqueado antes de enviar la muestra y tras un error de muestra.
- Tras el éxito de la muestra, comprobar que el drawer y todos los datos se conservan.
- En ACSA, comprobar que `enviar` solo, un código de otro servicio, mayúsculas distintas o espacios adicionales no habilitan el lote. Debe coincidir con el texto `enviar CODIGO_SERVICIO` mostrado debajo del campo.
- Modificar un campo o los archivos: exigir una nueva muestra antes de enviar el lote.
- Verificar que Enter no evita la confirmación, y que clics repetidos no duplican solicitudes.
- Comprobar que el error del lote conserva datos y que el éxito del lote limpia y cierra el formulario.
- En otros clientes, verificar confirmación sin exigir muestra.
- Confirmar en backend el resultado de `/SendTestEmail`. El build por sí solo no verifica endpoints ni procesos de creación.
