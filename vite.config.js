import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/plvylist-player.js",
      formats: ["es"],
    },
  },
});
