import { defineConfig } from "vite";
// import VitePluginCustomElementsManifest from "vite-plugin-cem";
// import { jsdocExamplePlugin } from "cem-plugin-jsdoc-example";
// import { asyncFunctionPlugin } from "cem-plugin-async-function";
// import { generateCustomData } from "cem-plugin-vs-code-custom-data-generator";
// import { generateWebTypes } from "cem-plugin-jet-brains-ide-integration";

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
    // plugins: [
    //   VitePluginCustomElementsManifest({
    //     files: ["./src/plvylist.js"],
    //     plugins: [
    //       asyncFunctionPlugin(),
    //       jsdocExamplePlugin(),
    //       generateCustomData(ideIntegrations),
    //       generateWebTypes(ideIntegrations),
    //     ],
    //   }),
    // ],
  };
});
