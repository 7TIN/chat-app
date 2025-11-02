import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: [
      "js/recommended",
      ...tseslint.configs.recommended,      // basic TS rules
      ...tseslint.configs.recommendedTypeChecked, // enables type-aware linting
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: "./tsconfig.json", // <-- REQUIRED for type checking
      },
    },
  },
]);