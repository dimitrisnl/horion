import js from "@eslint/js";
import eslint from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import {defineConfig, globalIgnores} from "eslint/config";
import pluginDrizzle from "eslint-plugin-drizzle";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    ".vinxi",
    "build",
    "dist",
    "node_modules",
    ".output",
    ".nitro",
    ".tanstack",
    ".turbo",
    ".astro",
  ]),
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  pluginReact.configs.flat.recommended,
  pluginReactHooks.configs["recommended-latest"],
  pluginPrettier,
  ...pluginRouter.configs["flat/recommended"],
  pluginJsxA11y.flatConfigs.strict,
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
      drizzle: pluginDrizzle,
      import: pluginImport,
    },
    rules: {
      "@typescript-eslint/array-type": ["warn", {default: "generic"}],
      "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_"}],
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",
      "id-length": ["warn", {min: 2, exceptions: ["_"]}],
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^node:"],
            ["^react", "^@?react"],
            ["^@horionos"],
            ["^@tanstack"],
            ["^hono"],
            ["^@?\\w"],
            ["^"],
            ["^\\."],
          ],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    ...js.configs.recommended,
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {globals: {...globals.browser, ...globals.node}},
  },
]);
