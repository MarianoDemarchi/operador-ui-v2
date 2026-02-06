import { useQuery } from "@tanstack/react-query";
import { LotesLegacyApi } from "../../../api/lotes-legacy";

export interface LegacyDynamicField {
  nombre: string;
  nombre_largo: string;
  control_html: "combobox" | "radiobutton" | "datapicker" | "combobox-edit";
  posibles?: string;
  mascara?: string;
}

interface Params {
  servicioId?: number;
  base?: string;
}

export const useLegacyDynamicFields = ({ servicioId, base }: Params) =>
  useQuery<LegacyDynamicField[]>({
    queryKey: ["legacy-dynamic-fields", servicioId, base],
    enabled: !!servicioId && !!base,
    queryFn: async () => {
      const resp = await LotesLegacyApi.getCamposDinamicos(servicioId!, base!);
      return resp.data as LegacyDynamicField[];
    },
  });
