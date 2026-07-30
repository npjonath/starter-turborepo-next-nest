import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { baseConfig } from "./base.js";

const reactFiles = ["**/*.{js,mjs,jsx,mjsx,ts,tsx,mtsx}"];

/**
 * Shared React configuration for browser-facing applications and libraries.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const reactInternalConfig = defineConfig(
  ...baseConfig,
  {
    ...eslintReact.configs["recommended-type-checked"],
    files: reactFiles,
    languageOptions: {
      ...eslintReact.configs["recommended-type-checked"].languageOptions,
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },
  {
    ...pluginReactHooks.configs.flat.recommended,
    files: reactFiles,
  },
);

// Backwards-compatible alias for existing consumers.
export const config = reactInternalConfig;
