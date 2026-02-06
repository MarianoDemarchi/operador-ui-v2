import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {

            // ✅ AntD separado (pesado y estable)
            if (id.includes("antd")) {
              return "antd";
            }

            // ✅ React Query separado
            if (id.includes("@tanstack/react-query")) {
              return "query";
            }

            // ❌ NO separar React
            // ❌ NO separar Amplify

            return "vendor";
          }
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "antd",
      "@tanstack/react-query",
      "aws-amplify",
      "@aws-amplify/ui-react",
    ],
  },
});
