import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { baseConfig } from "./base.js";

/**
 * Shared NestJS configuration for application and Jest test code.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nestJsConfig = defineConfig(
  ...baseConfig,
  globalIgnores(["eslint.config.mjs"]),
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Decorator metadata makes empty module/controller classes meaningful.
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
  {
    files: ["**/*.spec.ts", "test/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
);
