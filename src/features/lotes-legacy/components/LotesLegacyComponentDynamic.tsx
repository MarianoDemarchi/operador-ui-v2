// import { Form, Select, Radio, DatePicker, AutoComplete } from "antd";
// import { useEffect } from "react";
// import {
//   useLegacyDynamicFields,
//   type LegacyDynamicField,
// } from "../hooks/useLotesLegacyDynamic";

// interface Props {
//   servicioId: number;
//   base: string;
//   onChange: (
//     values: Record<string, any>,
//     mascaras: Record<string, string>,
//   ) => void;
// }

// export const DynamicFields: React.FC<Props> = ({
//   servicioId,
//   base,
//   onChange,
// }) => {
//   const { data, isLoading } = useLegacyDynamicFields({ servicioId, base });
//   const form = Form.useFormInstance();

//   const etiquetas = Form.useWatch("etiquetas", form);

//   useEffect(() => {
//     if (!etiquetas || !data) return;

//     const masks: Record<string, string> = {};

//     data.forEach((field) => {
//       const value = etiquetas[field.nombre];
//       if (!value || !field.posibles) return;

//       try {
//         const posibles = JSON.parse(field.posibles);
//         const match = posibles.find((p: any) => p.valor === value);

//         if (match?.mascara) {
//           masks[field.nombre] = match.mascara;
//         }
//       } catch {
//         // posibles mal formados
//       }
//     });

//     onChange(etiquetas, masks);
//   }, [etiquetas, data]);

//   if (isLoading || !data?.length) return null;

//   return (
//     <>
//       {data.map((field: LegacyDynamicField) => {
//         const posibles = field.posibles ? JSON.parse(field.posibles) : [];
//         const namePath = ["etiquetas", field.nombre];

//         switch (field.control_html) {
//           case "combobox":
//             return (
//               <Form.Item
//                 key={field.nombre}
//                 label={field.nombre_largo}
//                 name={namePath}
//                 rules={[{ required: true, message: "Campo obligatorio" }]}
//               >
//                 <Select allowClear>
//                   {posibles.map((p: any) => (
//                     <Select.Option key={p.valor} value={p.valor}>
//                       {p.valor}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             );

//           case "radiobutton":
//             return (
//               <Form.Item
//                 key={field.nombre}
//                 label={field.nombre_largo}
//                 name={namePath}
//                 rules={[{ required: true, message: "Campo obligatorio" }]}
//               >
//                 <Radio.Group>
//                   {posibles.map((p: any) => (
//                     <Radio key={p.valor} value={p.valor}>
//                       {p.valor}
//                     </Radio>
//                   ))}
//                 </Radio.Group>
//               </Form.Item>
//             );

//           case "datapicker":
//             return (
//               <Form.Item
//                 key={field.nombre}
//                 label={field.nombre_largo}
//                 name={namePath}
//                 rules={[{ required: true, message: "Campo obligatorio" }]}
//               >
//                 <DatePicker style={{ width: "100%" }} />
//               </Form.Item>
//             );

//           case "combobox-edit":
//             return (
//               <Form.Item
//                 key={field.nombre}
//                 label={field.nombre_largo}
//                 name={namePath}
//                 rules={[{ required: true, message: "Campo obligatorio" }]}
//               >
//                 <AutoComplete
//                   options={posibles.map((p: any) => ({
//                     value: p.valor,
//                   }))}
//                   placeholder="Escribí para buscar"
//                 />
//               </Form.Item>
//             );
//           default:
//             return null;
//         }
//       })}
//     </>
//   );
// };

import { Form, Select, Radio, DatePicker, AutoComplete, Input } from "antd";
import { useEffect } from "react";
import {
  useLegacyDynamicFields,
  type LegacyDynamicField,
} from "../hooks/useLotesLegacyDynamic";

interface Props {
  servicioId: number;
  base: string;
  codigoCliente?: string;
  onChange: (
    values: Record<string, any>,
    mascaras: Record<string, string>,
  ) => void;
}

export const DynamicFields: React.FC<Props> = ({
  servicioId,
  base,
  codigoCliente,
  onChange,
}) => {
  const { data, isLoading } = useLegacyDynamicFields({
    servicioId,
    base,
  });

  const form = Form.useFormInstance();

  const etiquetas = Form.useWatch("etiquetas", form);

  // Resetear campos al cambiar servicio/base
  useEffect(() => {
    form.setFieldsValue({
      etiquetas: {},
    });

    onChange({}, {});
  }, [servicioId, base]);

  // Detectar cambios y construir máscaras
  useEffect(() => {
    if (!etiquetas || !data) return;

    const masks: Record<string, string> = {};

    data.forEach((field) => {
      const value = etiquetas[field.nombre];

      if (!value || !field.posibles) return;

      try {
        const posibles = JSON.parse(field.posibles);

        const match = posibles.find((p: any) => p.valor === value);

        if (match?.mascara) {
          masks[field.nombre] = match.mascara;
        }
      } catch (e) {
        console.error("Error parseando posibles:", e);
      }
    });

    onChange(etiquetas, masks);
  }, [etiquetas, data]);

  if (isLoading || !data?.length) {
    return null;
  }

  return (
    <>
      {data.map((field: LegacyDynamicField) => {
        let posibles: any[] = [];

        try {
          posibles = field.posibles ? JSON.parse(field.posibles) : [];
        } catch {
          posibles = [];
        }

        const namePath = ["etiquetas", field.nombre];
        const esPeriodoAcsa = codigoCliente === "ACSA" &&
          [field.nombre, field.nombre_largo].some((nombre) =>
            /(^|[^a-z])periodo([^a-z]|$)/.test(
              nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
            ),
          );
        const normalizePeriodo = (value: unknown, previous: unknown) =>
          esPeriodoAcsa && typeof value === "string" && value.includes("-")
            ? previous
            : value;
        const reglas = [
          { required: true, message: "Campo obligatorio" },
          ...(esPeriodoAcsa ? [{
            validator: (_: unknown, value: unknown) =>
              typeof value === "string" && value.includes("-")
                ? Promise.reject(new Error("El período debe usar /, no guiones."))
                : Promise.resolve(),
          }] : []),
        ];
        if (esPeriodoAcsa) {
          posibles = posibles.filter((p: { valor: unknown }) => !String(p.valor).includes("-"));
        }

        switch (field.control_html) {
          case "combobox":
            return (
              <Form.Item
                key={field.nombre}
                label={field.nombre_largo}
                name={namePath}
                rules={reglas}
                normalize={normalizePeriodo}
                extra={esPeriodoAcsa ? "Usá / como separador del período (ejemplo: 10/2026). No se permiten guiones." : undefined}
              >
                <Select allowClear>
                  {posibles.map((p: any) => (
                    <Select.Option key={p.valor} value={p.valor}>
                      {p.valor}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            );

          case "radiobutton":
            return (
              <Form.Item
                key={field.nombre}
                label={field.nombre_largo}
                name={namePath}
                rules={reglas}
                normalize={normalizePeriodo}
                extra={esPeriodoAcsa ? "Usá / como separador del período (ejemplo: 10/2026). No se permiten guiones." : undefined}
              >
                <Radio.Group>
                  {posibles.map((p: any) => (
                    <Radio key={p.valor} value={p.valor}>
                      {p.valor}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            );

          case "datapicker":
            return (
              <Form.Item
                key={field.nombre}
                label={field.nombre_largo}
                name={namePath}
                rules={reglas}
                normalize={normalizePeriodo}
                extra={esPeriodoAcsa ? "Usá / como separador del período (ejemplo: 10/2026). No se permiten guiones." : undefined}
              >
                <DatePicker format={esPeriodoAcsa ? "DD/MM/YYYY" : undefined} style={{ width: "100%" }} />
              </Form.Item>
            );

          case "combobox-edit":
            return (
              <Form.Item
                key={field.nombre}
                label={field.nombre_largo}
                name={namePath}
                rules={reglas}
                normalize={normalizePeriodo}
                extra={esPeriodoAcsa ? "Usá / como separador del período (ejemplo: 10/2026). No se permiten guiones." : undefined}
              >
                {esPeriodoAcsa ? (
                  <Input
                    allowClear
                    placeholder="Ejemplo: 10/2026"
                    onKeyDown={(event) => {
                      if (event.key === "-") event.preventDefault();
                    }}
                    onBeforeInput={(event) => {
                      if ((event.nativeEvent as InputEvent).data?.includes("-")) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      if (event.clipboardData.getData("text").includes("-")) {
                        event.preventDefault();
                      }
                    }}
                  />
                ) : <AutoComplete
                  allowClear
                  options={posibles.map((p: any) => ({
                    value: p.valor,
                  }))}
                  placeholder="Escribí para buscar"
                  filterOption={(inputValue, option) =>
                    option?.value
                      ?.toUpperCase()
                      ?.includes(inputValue.toUpperCase())
                  }
                />}
              </Form.Item>
            );

          default:
            return null;
        }
      })}
    </>
  );
};