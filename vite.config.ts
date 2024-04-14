import path from "path"
import glsl from "vite-plugin-glsl"

import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["three", "mermaid"],
  },
  plugins: [glsl()],
})
