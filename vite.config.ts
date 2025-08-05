import { defineConfig, UserConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcssPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { resolve } from "path";

export default defineConfig(({ mode }): UserConfig => {
  const base = {
    plugins: [solidPlugin()],
    base: "./",
    css: {
      postcss: {
        plugins: [tailwindcssPostcss, autoprefixer],
      },
    },
  };

  const configs: Record<string, UserConfig> = {
    glazewm: {
      build: {
        outDir: "dist/glazewm",
        target: "esnext",
        rollupOptions: {
          input: resolve(__dirname, "glazewm.html"),
        },
      },
    },
    komorebi: {
      build: {
        outDir: "dist/komorebi",
        target: "esnext",
        rollupOptions: {
          input: resolve(__dirname, "komorebi.html"),
        },
      },
    },
    vanilla: {
      build: {
        outDir: "dist/vanilla",
        target: "esnext",
        rollupOptions: {
          input: resolve(__dirname, "vanilla.html"),
        },
      },
    },
  };

  return {
    ...base,
    ...(configs[mode] || configs.glazewm),
  };
});
