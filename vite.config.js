import { defineConfig } from "vite";
import VitePluginCustomElementsManifest from "vite-plugin-cem";
import { jsdocExamplePlugin } from "cem-plugin-jsdoc-example";
import { asyncFunctionPlugin } from "cem-plugin-async-function";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/plvylist.js",
      formats: ["es"],
    },
  },
  plugins: [
    VitePluginCustomElementsManifest({
      files: ["./src/plvylist.js"],
      plugins: [asyncFunctionPlugin, jsdocExamplePlugin],
    }),
  ],
});
