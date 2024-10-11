import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_SAOZP_BACKEND_URL ?? "http://localhost:3000",
        // target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          return path.replace(/^\/api/, "");
        },
        // configure: (proxy, options) => {
        //   proxy.on("proxyReq", (proxyReq, req, res) => {
        //     proxyReq.setHeader("Origin", "http://localhost:3000");
        //   });
        // },
      },
    },
    cors: false,
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
  // preview: {
  //   // host: "172.19.0.4",
  //   port: 5173,
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:3000",
  //       // target: process.env.VITE_SAOZP_BACKEND_URL ?? "http://localhost:3000",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
});
