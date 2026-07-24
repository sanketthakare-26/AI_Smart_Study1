// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  nitro: {
    preset: "node-server",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  tanstackRouter: {
    // Tell TanStack Router to generate .jsx routes and output routeTree.gen.js
    routeFilePrefix: "",
    routeFileIgnorePrefix: "-",
    routesDirectory: "./src/routes",
    generatedRouteTree: "./src/routeTree.gen.js",
    routeExtensions: [".jsx", ".js"],
    addExtensions: true,
    disableTypes: true,
  },
  vite: {
    resolve: {
      extensions: [".js", ".jsx", ".json", ".css", ".mjs", ".ts", ".tsx", ".mts"],
      alias: {
        "react/jsx-dev-runtime": resolve(__dirname, "src/jsx-dev-runtime-shim.js"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  },
});
