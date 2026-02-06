import { useMemo, useState } from "react";
import type { LoteLegacy } from "../models/lote-legacy.model";

export const useLotesSelection = () => {
  const [selected, setSelected] = useState<LoteLegacy[]>([]);

  const toggle = (lote: LoteLegacy) => {
    setSelected((prev) =>
      prev.find((l) => l.id_lote === lote.id_lote) ? [] : [lote]
    );
  };

  const state = useMemo(() => {
    const lote = selected[0];
    if (!lote) {
      return {
        canEnviar: false,
        canCancelar: false,
        canDetener: false,
        canSumarizar: false,
      };
    }

    return {
      canEnviar: lote.estado === "Preparado OK",
      canCancelar: lote.estado === "Preparado OK",
      canDetener: lote.estado === "Enviando",
      canSumarizar: lote.estado === "Enviado OK",
    };
  }, [selected]);

  return {
    selected,
    toggle,
    ...state,
  };
};
