import { useQuery } from "@tanstack/react-query";
import { EmsionesPapel } from "../../../api/emisiones-papel";
import type { PorcionCabecera } from "../models/porciones.cabecera.models";

export const useCabecerasQuery = () =>
  useQuery<PorcionCabecera[]>({
    queryKey: ["cabeceras"],
    queryFn: async () => {
      const resp = await EmsionesPapel.getCabeceras();
      const raw: any[][] = JSON.parse(resp.data.body);

      const options: PorcionCabecera[] = raw.map((item) => ({
        value: item[0],
        label: item[0],
      }));

      // 🔑 eliminar duplicados por value
      return Array.from(
        new Map(options.map((opt) => [opt.value, opt])).values()
      );
    },
  });

