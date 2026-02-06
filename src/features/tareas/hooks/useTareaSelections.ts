import { useMemo, useState } from "react";
import type { Tarea } from "../models/tarea.model";

export const useTareaSelections = () => {
  const [selected, setSelected] = useState<Tarea[]>([]);

  const toggle = (lote: Tarea) => {
    setSelected((prev) =>
      prev.find((l) => l.id_lote === lote.id_lote) ? [] : [lote],
    );
  };

  const state = useMemo(() => {
    const lote = selected[0];
    if (!lote) {
      return {
        canReenvio: false,
        canReporte: false,
      };
    }

    return {
      canReenvio: lote.accion_pendiente.includes("eenvío"),
      canReporte: lote.accion_pendiente.includes("CSV_Entrega"),
    };
  }, [selected]);

  return {
    selected,
    toggle,
    ...state,
  };
};
