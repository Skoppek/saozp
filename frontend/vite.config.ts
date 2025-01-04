import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3001,
    strictPort: true,
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
});
