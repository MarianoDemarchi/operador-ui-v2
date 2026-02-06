interface Params {
  files: string[];
  filtros: Record<string, string>;
  mascara: {
    Canal?: string;
    Organizacion?: string;
    Servicios?: string;
    Distribuidora?: string;
    Clientes?: string;
    [key: string]: string | undefined; // 👈 permite nuevas máscaras (Secuencia, etc)
  };
}

type MascaraMap = Record<string, string>;

const safeParse = <T>(value?: string): T | undefined => {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
};

const buildParsedMascara = (mascara: Params["mascara"]): MascaraMap => {
  return Object.entries(mascara).reduce<MascaraMap>((acc, [key, value]) => {
    if (!value) return acc;

    const parsed = safeParse<{ codigo?: string }>(value);
    acc[key] = parsed?.codigo ?? value;

    return acc;
  }, {});
};

const matchAllMascaras = (
  row: string,
  mascaras: MascaraMap,
  exclude: string[] = []
) => {
  return Object.entries(mascaras)
    .filter(([k]) => !exclude.includes(k))
    .every(([, v]) => row.includes(v));
};

export const useFilteredLegacyFiles = ({
  files,
  mascara,
}: Params): string[] => {
  const parsedMascara = buildParsedMascara(mascara);

  return files.filter((row) => {
    /* ======================
       SIN FILTROS
    ====================== */
    if (Object.keys(parsedMascara).length === 0) return true;

    /* ======================
       CANAL SMS
    ====================== */
    if (parsedMascara.Canal === "sms") {
      return (
        row.includes("ecogas-sms") &&
        matchAllMascaras(row, parsedMascara, ["Canal"])
      );
    }

    /* ======================
       EMAIL ECOG
    ====================== */
    if (
      parsedMascara.Organizacion === "ECOG" &&
      parsedMascara.Canal === "email"
    ) {
      const servicio = parsedMascara.Servicios;

      switch (servicio) {
        case "AVDEUP":
        case "ADEUDA":
        case "FCGNNC":
          return row.includes(parsedMascara.Distribuidora ?? "");

        case "FDENSU":
          return (
            matchAllMascaras(row, parsedMascara, [
              "Canal",
              "Servicios",
              "Organizacion",
            ]) ||
            row.includes("legajo_impositivo")
          );

        case "AVENSU":
          return /\bENSUD\b/i.test(row);

        case "GENERL":
          return row.includes(parsedMascara.Distribuidora ?? "");

        default:
          return matchAllMascaras(row, parsedMascara, [
            "Canal",
            "Servicios",
            "Organizacion",
          ]);
      }
    }

    /* ======================
       FALLBACK DINÁMICO
       👇 ahora incluye Secuencia, Lote, etc
    ====================== */
    return matchAllMascaras(row, parsedMascara, [
      "Canal",
      "Servicios",
      "Organizacion",
    ]);
  });
};
