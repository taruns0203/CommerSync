import { fileURLToPath } from "url";
import { dirname } from "path";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // Ignore patterns must be in their own config block
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/pnpm-lock.yaml",
      "**/prisma/generated/**"
    ]
  },
  // JavaScript files configurations
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": "error"
    }
  },
  // TypeScript configuration block
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ["./tsconfig.base.json", "**/tsconfig.json"],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "import": importPlugin,
      "simple-import-sort": simpleImportSort
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { "prefer": "type-imports", "fixStyle": "separate-type-imports" }
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ],
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // Code quality rules
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": "error",
      "max-depth": ["error", 4],
      "max-lines-per-function": ["warn", { "max": 60, "skipBlankLines": true, "skipComments": true }],

      // Import sorting configurations
      "simple-import-sort/imports": [
        "error",
        {
          "groups": [
            // 1. React, Next.js, and core frameworks
            ["^react$", "^next"],
            // 2. Third-party packages from npm
            ["^@?\\w"],
            // 3. Monorepo workspace internal packages
            ["^@client", "^@server"],
            // 4. Project level aliases
            ["^@/"],
            // 5. Relative file path imports
            ["^\\."],
            // 6. Global CSS imports
            ["\\.css$"]
          ]
        }
      ],
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off"
    }
  }
];
