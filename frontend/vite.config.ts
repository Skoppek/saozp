import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 80,
    strictPort: true,
    cors: false
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
