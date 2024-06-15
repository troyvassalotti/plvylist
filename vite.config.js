import { defineConfig } from "vite";
import nunjucks from "vite-plugin-nunjucks";
import readme from "./lib/parse-readme.js";
import VitePluginCustomElementsManifest from "vite-plugin-cem";
import { jsdocExamplePlugin } from "cem-plugin-jsdoc-example";
import { asyncFunctionPlugin } from "cem-plugin-async-function";
import { customElementVsCodePlugin } from "custom-element-vs-code-integration";
import { customElementJetBrainsPlugin } from "custom-element-jet-brains-integration";

const ideIntegrations = {
  outdir: "dist",
};

export default defineConfig(({ command, mode, ssrBuild }) => {
  const buildOptions =
    mode === "docs"
      ? { outDir: "docs" }
      : {
          lib: {
            entry: "src/plvylist.js",
            formats: ["es"],
          },
        };

  return {
    build: buildOptions,
    plugins: [
      nunjucks({
        variables: {
          "index.html": {
            title: "Plvylist | Web Audio Component",
            content: readme(),
          },
        },
      }),

      VitePluginCustomElementsManifest({
        files: ["./src/plvylist.js"],
        lit: true,
        plugins: [
          asyncFunctionPlugin(),
          jsdocExamplePlugin(),
          customElementVsCodePlugin(ideIntegrations),
          customElementJetBrainsPlugin(ideIntegrations),
        ],
      }),
    ],
  };
});
