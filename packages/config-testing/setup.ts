// setup.ts

// import "@commersync/tsconfig/setup";

// Purpose

// Shared test setup executed before every test file.
// A single location to register global test utilities and configure test environment.
// Reduces boilerplate across all packages.

// Responsibilities

// Import tsconfig setup for type-checking guarantees
// Initialize test environment as needed (e.g., mock data, timers, or shared services)
// Configure assertion helpers or matchers
// Execute once before all test files

// Why it exists

// Avoids repeating setup logic in every package’s test files
// Centralizes test environment configuration
// Reduces test boilerplate and configuration drift
// Ensures consistent test behavior throughout the monorepo
