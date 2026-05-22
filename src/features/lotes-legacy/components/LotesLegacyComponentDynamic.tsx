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

import { Form, Select, Radio, DatePicker, AutoComplete } from "antd";
import { useEffect } from "react";
import {
  useLegacyDynamicFields,
  type LegacyDynamicField,
} from "../hooks/useLotesLegacyDynamic";

interface Props {
  servicioId: number;
  base: string;
  onChange: (
    values: Record<string, any>,
    mascaras: Record<string, string>,
  ) => void;
}

export const DynamicFields: React.FC<Props> = ({
  servicioId,
  base,
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

        switch (field.control_html) {
          case "combobox":
            return (
              <Form.Item
                key={field.nombre}
                label={field.nombre_largo}
                name={namePath}
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
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
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
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
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            );

          case "combobox-edit":
            return (
              <Form.Item
                key={field.nombre}
                label={field.nombre_largo}
                name={namePath}
                rules={[
                  {
                    required: true,
                    message: "Campo obligatorio",
                  },
                ]}
              >
                <AutoComplete
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
                />
              </Form.Item>
            );

          default:
            return null;
        }
      })}
    </>
  );
};