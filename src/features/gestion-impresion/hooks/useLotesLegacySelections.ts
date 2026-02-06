import { useMemo, useState } from "react";
import type { Emision } from "../models/emision.model";

export const useEmisionSelections = () => {
  const [selected, setSelected] = useState<Emision[]>([]);

  const toggle = (emision: Emision) => {
    setSelected((prev) =>
      prev.find((l) => l.id_emision === emision.id_emision) ? [] : [emision],
    );
  };

  const state = useMemo(() => {
    const emision = selected[0];

    if (!emision) {
      return {
        canEliminar: false,
      };
    }

    return {
      canEliminar: emision.estado !== "Archivos Subidos",
    };
  }, [selected]);

  return {
    selected,
    toggle,
    state,
  };
};
