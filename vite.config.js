// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // lodash: ["lodash"],
          "react-dom": ["react-dom"],
          axios: ["axios"],
          mui: ["@mui/material", "@mui/icons-material"],
          // "material-react-table": ["material-react-table"],
          rsuite: ["rsuite"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
