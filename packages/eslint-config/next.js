import pluginNext from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { reactInternalConfig } from "./react-internal.js";

const nextFiles = ["**/*.{js,mjs,jsx,mjsx,ts,tsx,mtsx}"];

/**
 * Shared Next.js configuration with Core Web Vitals rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = defineConfig(
  ...reactInternalConfig,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: nextFiles,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
);
