// hooks/useMensajeTelegram.ts
import type { Emision } from "../models/emision.model";

export const buildMensajeTelegram = (fila?: Emision | null) => {
  if (!fila) return "";

  const fecha = fila.fecha?.replaceAll(" ", "");

  const distribuidora =
    fila.distribuidora?.charAt(0).toUpperCase() +
    fila.distribuidora?.slice(1).toLowerCase();

  const servicio =
    fila.servicio?.charAt(0).toUpperCase() +
    fila.servicio?.slice(1).toLowerCase();

  const comprobantes = new Intl.NumberFormat("es-AR").format(
    fila.comprobantes || 0
  );

  return `📅 ${fecha}
🏢 ${distribuidora}
📄 ${servicio}
✅ ${comprobantes} comprobantes subidos`;
};
