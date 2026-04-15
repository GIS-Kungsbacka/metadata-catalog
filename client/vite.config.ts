import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Get IIS application base path from environment variable
// Default: /geodata (client is an IIS application under geodata root)
// If geodata root is different, set VITE_APP_BASE environment variable
// If you want client at root of geodata, set VITE_CLIENT_AT_ROOT=true
declare const process: { cwd(): string; env: Record<string, string> };

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appBase = env.VITE_APP_BASE || "/geodata";
  const clientAtRoot = env.VITE_CLIENT_AT_ROOT === "true";
  const basePath = clientAtRoot ? `${appBase}/` : `${appBase}/metadatakatalog/`;

  return {
    plugins: [react()],
    base: basePath,
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: "https://localhost:7258",
          changeOrigin: true,
          secure: false,
          //rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
  };
});
