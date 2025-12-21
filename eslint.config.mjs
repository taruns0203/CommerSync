import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/out/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/pnpm-lock.yaml",
    ],
  },
  // JavaScript files
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];

