import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  { ignores: ["node_modules/**", "legacy/**", "reports/**"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "object-shorthand": ["warn", "always"],
      "prefer-arrow-callback": "error",
      "logical-assignment-operators": ["warn", "always"],
      "guard-for-in": "error",
      "max-depth": ["warn", 3],
      "camelcase": "error",
    },
  },
  eslintConfigPrettier,
];
