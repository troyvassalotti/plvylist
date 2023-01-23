import { defineConfig } from "vite";
import VitePluginCustomElementsManifest from "vite-plugin-cem";
import { jsdocExamplePlugin } from "cem-plugin-jsdoc-example";
import { asyncFunctionPlugin } from "cem-plugin-async-function";
import { generateCustomData } from "cem-plugin-vs-code-custom-data-generator";
import { generateWebTypes } from "cem-plugin-jet-brains-ide-integration";

const ideIntegrations = {
  outdir: "dist",
};

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
      plugins: [
        asyncFunctionPlugin(),
        jsdocExamplePlugin(),
        generateCustomData(ideIntegrations),
        generateWebTypes(ideIntegrations),
      ],
    }),
  ],
});
