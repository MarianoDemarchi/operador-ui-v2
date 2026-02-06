import type { ThemeConfig } from "antd";

export const operadorTheme: ThemeConfig = {
  token: {
    // Colores base
    colorPrimary: "#1F4AA8",
    colorInfo: "#1F4AA8",

    colorSuccess: "#2E7D32",
    colorWarning: "#ED6C02",
    colorError: "#D32F2F",

    // Fondo general
    colorBgBase: "#FFFFFF",
    colorBgLayout: "#F5F7FA",
    colorBgContainer: "#FFFFFF",

    // Texto
    colorText: "#1F2937",
    colorTextSecondary: "#6B7280",
    colorTextTertiary: "#9CA3AF",

    // Bordes
    colorBorder: "#E5E7EB",
    borderRadius: 6,

    // Tipografía
    fontFamily: "Inter, Roboto, system-ui, sans-serif",
    fontSize: 15,

    // Control de alturas (modo compacto)
    controlHeight: 30,
    controlHeightSM: 26,
  },

  components: {
    Table: {
      fontSize: 13,
      headerBg: "#FAFAFA",
      headerColor: "#374151",
      headerSplitColor: "#E5E7EB",
      rowHoverBg: "#F0F7FF",
      rowSelectedBg: "#E6F4FF",
      rowSelectedHoverBg: "#DCEEFB",
      cellPaddingBlock: 6,
      cellPaddingInline: 8,
    },

    Button: {
      borderRadius: 6,
      fontWeight: 500,
      controlHeight: 30,
    },

    Tag: {
      borderRadius: 4,
      fontSizeSM: 11,
    },

    Layout: {
      siderBg: "#0B1D36",
      headerBg: "#FFFFFF",
      bodyBg: "#F5F7FA",
    },

    Pagination: {
      itemSize: 28,
      fontSize: 12,
    },

    Progress: {
      lineBorderRadius: 4,
    },
  },
};
