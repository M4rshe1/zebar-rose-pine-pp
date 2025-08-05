import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcssPostcss from "@tailwindcss/postcss"
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  base: "./",
  build: {
    target: "esnext",
  },
  css: {
    postcss: {
      plugins: [tailwindcssPostcss, autoprefixer],
    },
  },
});
