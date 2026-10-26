import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    // Keep the browser's Host header: the API's cross-site check compares it with Origin.
    proxy: { "/api": { target: "http://localhost:5050", changeOrigin: false } },
  },
});
