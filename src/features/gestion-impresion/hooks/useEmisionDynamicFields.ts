import { useQuery } from "@tanstack/react-query";
import { EmsionesPapel } from "../../../api/emisiones-papel";


interface Params {
  servicio?: string;
  distribuidora?: string;
}
interface ArchivoInfo {
  nombreArchivo: string;
  logId: string;
}

interface EmisionFileResult {
  listaArchivos: string[];
  archivos: ArchivoInfo[];
}

export const useEmisionFile = ({ servicio, distribuidora }: Params) =>
  useQuery<EmisionFileResult>({
    queryKey: ["controles-emision", distribuidora, servicio],
    queryFn: async () => {
      const resp = await EmsionesPapel.getArchivos(distribuidora!, servicio!);

      const data = resp.data as {
        data: string[];
        listaArchivos: string[];
      };

      const archivos: ArchivoInfo[] = [];

      for (let i = 0; i < data.data.length; i += 2) {
        archivos.push({
          nombreArchivo: data.data[i],
          logId: data.data[i + 1],
        });
      }

      return {
        listaArchivos: data.listaArchivos,
        archivos,
      };
    },
    enabled: !!servicio && !!distribuidora,
  });
