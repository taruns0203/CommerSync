# CommerSync ESLint Standards Handbook

> **Document Status:** Approved  
> **Version:** 1.0.0  
> **Audience:** All Engineers, Platform Engineers, CI/CD Developers  
> **Applies To:** Entire CommerSync Platform (React frontend, Node/Express
> backends, shared config files, and libraries)

---

## Executive Summary

At CommerSync, static code analysis is treated as a critical production gate.
Code formatting concerns are delegated to Prettier, but **code quality**, **type
safety**, **security vulnerabilities**, and **architectural boundaries** are
strictly enforced by ESLint.

Automated linting directly impacts:

- **Production Bugs Prevention:** Catching unhandled promises, incorrect types,
  or missing dependency arrays before code is built.
- **Security Gating:** Flagging execution vulnerabilities like `eval`, prototype
  pollution, or unsafe regular expressions at commit time.
- **Review Efficiency:** Eliminating subjective syntax debates, allowing reviews
  to focus solely on system design.

---

## 1. Linting Philosophy

### 1.1 Machine-Enforced Rules

- **Rule:** If a rule can be validated by a lint checker, it **must** be
  automated. We do not rely on developers remembering styling, import, or safety
  rules during local development.
- **Why:** Automation reduces human error, guarantees uniformity, and acts as a
  strict blocker in the CI pipeline.

### 1.2 Explicitness over Implicit Assumptions

- **Rule:** Prefer explicit declarations (e.g., return types, dependency lists,
  type imports) over compiler implicit guesses.
- **Why:** Makes code easier to read for future maintainers and prevents silent
  type drifts.

### 1.3 Warnings are Errors in CI

- **Rule:** In local development, minor infractions can be warnings. In the CI
  pipeline, all warnings are treated as **hard build errors** and block the
  merge.
- **Why:** Prevents warning fatigue where developers ignore build output logs.

---

## 2. ESLint Architecture & Flat Config

CommerSync adopts **ESLint v9 Flat Config** (`eslint.config.mjs`).

### Why Flat Config?

- **Single Configuration Object:** Replaces the deprecated `.eslintrc` config
  inheritance model with a clean array of configuration blocks.
- **Performance:** Flat configs load plugins and parse typescript files up to
  2-3x faster.
- **Explicit Matching:** Uses explicit `files` and `ignores` glob patterns
  instead of folder-based cascading settings.

---

## 3. Mandatory Plugins

We compile and configure standard industry plugins:

| Plugin                             | Purpose                         | Why                                                                        |
| ---------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `@typescript-eslint`               | TypeScript type-aware linting   | Restricts unsafe typing, floating promises, and missing type declarations. |
| `eslint-plugin-import`             | Validate import statements      | Prevents duplicate imports and validates modules.                          |
| `eslint-plugin-simple-import-sort` | Sort imports deterministically  | Resolves code diff noise.                                                  |
| `eslint-plugin-security`           | Static security scanner         | Catches object injection, regex DOS, and execution exploits.               |
| `eslint-config-prettier`           | Disable conflicting style rules | Turns off rules that conflict with Prettier.                               |

---

## 4. Key Rule Specifications

### 4.1 TypeScript Safety

- `@typescript-eslint/no-explicit-any`: Set to `"error"`. Using `any` is
  prohibited. Use `unknown` for dynamic values.
- `@typescript-eslint/no-floating-promises`: Set to `"error"`. Async calls must
  be handled with `await` or `.catch()`.
- `@typescript-eslint/consistent-type-imports`: Set to `"error"`. Type-only
  imports must be declared explicitly as `import type { Type }`.

### 4.2 Import Ordering

- Sorted deterministically using `eslint-plugin-simple-import-sort`: React/Next
  -> External -> Monorepo -> Aliases -> Relative -> Styles.

### 4.3 Code Quality & Complexity

- `max-depth`: Limit nesting to 4 blocks.
- `max-lines-per-function`: Limit functions to 50 lines.
- `no-console`: Banned in production (use the
  [Logging Standards](file:///Users/Projects/CommerSync/docs/engineering/logging-standards.md)
  logger instead).

---

## 5. Quick Reference Cheat Sheet

- **Rule 1:** Unhandled async promises are lint errors (`no-floating-promises`).
- **Rule 2:** Always import types explicitly: `import type { Product }`.
- **Rule 3:** No `console.log` in production; use the CommerSync structured
  logger.
- **Rule 4:** All linter warnings fail the build in CI.
