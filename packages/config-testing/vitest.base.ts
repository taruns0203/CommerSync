import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
});

// vitest.base.ts

// Purpose

// Shared Vitest configuration for the entire monorepo. All applications and packages extend this configuration instead of maintaining duplicate test settings.

// Responsibilities

// Enable global test APIs (describe, it, expect)
// Configure Node test environment
// Enable V8 coverage provider
// Generate text, HTML, and LCOV coverage reports
// Store reports in the coverage/ directory
// Enforce minimum coverage thresholds (80%) for lines, branches, functions, and statements

// Why it exists

// Single source of truth for testing configuration
// Eliminates duplicated configuration across apps/packages
// Ensures consistent testing and coverage behavior throughout the monorepo
// Integrates seamlessly with Turbo and the CI pipeline
