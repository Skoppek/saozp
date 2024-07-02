import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: true,
    port: 5173,
    // proxy: {
    //   "/api": process.env.VITE_SAOZP_BACKEND_URL ?? "http://localhost:3000",
    // },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ["lodash"],
          monaco: ["@monaco-editor/react"],
          react_markdown: ["react-markdown"],
          flowbite: ["flowbite-react"],
        },
      },
    },
  },
  preview: {
    // host: "172.19.0.4",
    port: 5173,
    proxy: {
      "/api": process.env.VITE_SAOZP_BACKEND_URL ?? "http://localhost:3000",
    },
  },
});
