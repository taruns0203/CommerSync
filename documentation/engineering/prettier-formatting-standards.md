# CommerSync Prettier Formatting Standards Handbook

> **Document Status:** Approved  
> **Version:** 1.0.0  
> **Audience:** All Engineers, Tech Leads, DevOps, SREs  
> **Applies To:** Entire CommerSync Platform (React frontend, Node/Express
> backends, shared config, YAML/JSON, and docs)

---

## Executive Summary

At CommerSync's scale, code style consistency directly impacts engineering
velocity and operational safety:

- **Zero-Debate Reviews:** Automatic formatting ensures that Pull Request
  reviews focus entirely on business logic, performance, and architecture,
  rather than code formatting or formatting preferences.
- **Pragmatic Git Diffs:** By enforcing a strict, deterministic style rule (such
  as trailing commas and print limits), we minimize unnecessary lines changed in
  Git histories, preventing merge conflicts.
- **Onboarding Simplicity:** New engineers configure their local IDEs to format
  on save, allowing them to write compliant code immediately.
- **Relationship with ESLint:** ESLint is for **code quality** (analyzing static
  code patterns like unused variables or unsafe types). Prettier is exclusively
  for **code formatting** (indentation, spacing, line wrapping). They are
  integrated seamlessly to avoid rule conflicts.

---

## 1. Formatting Philosophy

### 1.1 Automatic Formatting Enforced

- **Rule:** Code formatting is completely automated. Developers must not format
  files manually. IDE formatting on save must be configured locally, and
  formatting must be verified in the CI pipeline.
- **Why:** Saves developer time and guarantees complete code formatting
  consistency without human intervention.

### 1.2 Git-Friendly Formatting

- **Rule:** Formatting decisions (such as trailing commas) must be optimized to
  produce the smallest possible Git diff.
- **Why:** Cleaner diffs make code review more efficient and reduce the
  likelihood of merge conflicts during parallel feature branches.

### 1.3 Readability Over Compactness

- **Rule:** Code layout should prioritize scannability and structural clarity
  over line compression.
- **Why:** Code is read many more times than it is written. Long lines must wrap
  cleanly.

---

## 2. Prettier Configuration Decisions

Every formatting decision in CommerSync's `.prettierrc.json` is justified below:

| Option              | Selected Value | Why                                                                                                                                                     |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"semi"`            | `true`         | Always use semicolons. Prevents Automatic Semicolon Insertion (ASI) runtime parsing edge-case bugs.                                                     |
| `"singleQuote"`     | `false`        | Use double quotes by default. Consistent with JSON format specifications and HTML/XML standards.                                                        |
| `"jsxSingleQuote"`  | `false`        | Use double quotes inside JSX attributes to align with standard HTML attribute formatting.                                                               |
| `"trailingComma"`   | `"es5"`        | Print trailing commas in arrays, objects, and function parameters where valid in ES5 (objects/arrays). Minimizes Git diff lines when adding properties. |
| `"printWidth"`      | `80`           | Wrap lines that exceed 80 characters. Standard for side-by-side Git diff code reviews on medium monitors.                                               |
| `"tabWidth"`        | `2`            | Use 2 spaces for indentation. Standard for nesting without consuming excessive print width.                                                             |
| `"useTabs"`         | `false`        | Indent with spaces rather than tab characters. Ensures consistent layout rendering across different editors (GitHub UI, GitLab, VS Code, VIM).          |
| `"bracketSpacing"`  | `true`         | Print spaces between object literal brackets (e.g., `{ x: y }`). Improves visual readability.                                                           |
| `"bracketSameLine"` | `false`        | Put the `>` of multi-line JSX elements on a new line. Keeps the element closing tag structurally separated from its attributes.                         |
| `"arrowParens"`     | `"always"`     | Always include parentheses around arrow function parameters (e.g., `(x) => x`). Simplifies adding type annotations later.                               |
| `"endOfLine"`       | `"lf"`         | Enforce Unix-style line endings (`\n`). Prevents casing diff conflicts on Windows vs. Linux development platforms.                                      |
| `"proseWrap"`       | `"always"`     | Wrap prose in Markdown files when exceeding print width. Ensures clean documentation layout.                                                            |
| `"quoteProps"`      | `"as-needed"`  | Only quote object property keys when syntactically required (e.g., when they contain hyphens).                                                          |

---

## 3. Language-Specific Guidelines

We apply Prettier formatting uniformly to all source extensions:

- **TypeScript (`.ts`, `.tsx`):** Handled via standard TypeScript parser. Always
  use explicit type spacing and strict return formatting.
- **Markdown (`.md`):** Formatted automatically. Bullet points use hyphens `-`,
  and code blocks must specify their language tag (e.g., ` ```typescript `) to
  enable nested syntax formatting.
- **YAML / JSON:** Enforced for configuration. Indentation must be exactly 2
  spaces. No trailing commas in JSON.
- **Prisma (`.prisma`):** Formatted natively using `prisma-format` to align
  model column properties.

---

## 4. Integration

### 4.1 ESLint Integration

- To avoid style conflicts, we use the `eslint-config-prettier` configuration.
  This turns off all ESLint style/formatting rules, delegating layout
  constraints entirely to Prettier, while ESLint continues to analyze code
  quality and type safety gates.

### 4.2 VS Code Integration

- The project workspace includes a `.vscode/settings.json` configuration file,
  which automatically configures Prettier as the default formatter and enables
  "Format on Save" for all developers.

### 4.3 Husky and lint-staged

- The pre-commit hook runs `lint-staged`. It intercepts files staged for commit
  and runs `prettier --write` (alongside `eslint --fix`), committing only
  properly formatted files.

---

## 5. Formatting Anti-Patterns

### Anti-Pattern 1: Manual Layout Spacing

- **Bad:** Indenting code blocks with tabs or random number of spaces.
- **Good:** Let Prettier auto-indent to exactly 2 spaces on save.

### Anti-Pattern 2: Disabling Format Checkers

- **Bad:** Committing code with `--no-verify` to bypass Husky checks.
- **Good:** Address any formatting issues before commit.

---

## 6. Quick Reference Cheat Sheet

- **Rule 1:** Always use semicolons (`semi: true`).
- **Rule 2:** Indent with exactly 2 spaces (no tabs).
- **Rule 3:** Use double quotes for strings.
- **Rule 4:** Keep line length within 80 characters.
- **Rule 5:** Trailing commas enabled in ES5 structures (arrays, objects).
- **Rule 6:** Let IDE format on save automatically.
