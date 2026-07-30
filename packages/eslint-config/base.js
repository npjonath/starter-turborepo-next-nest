import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

const codeFiles = ["**/*.{js,mjs,cjs,jsx,mjsx,ts,mts,cts,tsx,mtsx}"];
const typeScriptFiles = ["**/*.{ts,mts,cts,tsx,mtsx}"];

/**
 * Shared, framework-agnostic ESLint configuration.
 *
 * Type-aware rules use the same TypeScript project service as editors, while
 * Prettier remains responsible for formatting.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const baseConfig = defineConfig(
  globalIgnores([
    "**/.next/**",
    "**/.turbo/**",
    "**/coverage/**",
    "**/dist/**",
    "**/node_modules/**",
  ]),
  {
    files: codeFiles,
    extends: [js.configs.recommended],
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: typeScriptFiles,
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },
  turboPlugin.configs["flat/recommended"],
  eslintConfigPrettier,
);

// Backwards-compatible alias for existing consumers.
export const config = baseConfig;
