# CommerSync TypeScript Style Guide

> **Document Status:** Approved  
> **Version:** 1.0.0  
> **Audience:** All Engineers, Staff Engineers, Tech Leads, SREs, New Hires  
> **Applies To:** Entire CommerSync Platform (Next.js client apps, Express
> backend services, shared packages)

---

## Executive Summary

At FAANG-scale, codebases cease to be just code—they become distributed software
ecosystems. With 15+ backend microservices, multiple frontend applications, and
numerous shared packages, CommerSync requires a strict, standardized, and highly
predictable TypeScript style guide.

The goal of this guide is to achieve **zero runtime type-related exceptions**,
**maximized build-time safety**, and **complete uniformity** across all teams.
Type safety is treated as a security boundary and an operational gate. Every
engineer is expected to adhere to these rules without exception. Compliance is
enforced through ESLint flat configs, CI/CD blockers, and mandatory peer-review
approvals.

---

## Table of Contents

1. [Strict Type Safety Gates](#1-strict-type-safety-gates)
2. [Type Modeling & Declarations](#2-type-modeling--declarations)
3. [Advanced Type Construction](#3-advanced-type-construction)
4. [Function Architecture](#4-function-architecture)
5. [Data Immutability & Value Semantics](#5-data-immutability--value-semantics)
6. [Architecture & Dependency Design](#6-architecture--dependency-design)
7. [Code Quality & Standards](#7-code-quality--standards)
8. [Operational Safety](#8-operational-safety)
9. [Synthesis & Reference](#9-synthesis--reference)

---

## 1. Strict Type Safety Gates

### 1.1 Strict Mode Enforcement

#### Rule

TypeScript compiler's `"strict": true` flag must be set in the root
`tsconfig.base.json` and must never be overridden or set to `false` in any
package or application-level `tsconfig.json`.

#### Why this rule exists

TypeScript without strict mode is JavaScript with comments. Disabling strict
mode allows null pointer exceptions, implicit `any` assignments, and unsafely
typed constructors to slip past the compiler. This negates the ROI of using
TypeScript and compromises our production reliability targets.

#### Good Example

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

#### Bad Example

```json
// server/services/product-service/tsconfig.json
{
  "compilerOptions": {
    "strict": false
  }
}
```

#### Exceptions

None.

---

### 1.2 noImplicitAny

#### Rule

Implicit `any` is strictly prohibited. All variables, parameters, return types,
and properties that cannot be automatically inferred by the compiler must be
explicitly typed.

#### Why this rule exists

Implicit `any` disables type checking on the variable in question. This creates
a type safety "black hole" that spreads to all downstream consumers, converting
TypeScript back into unsafely typed JavaScript.

#### Good Example

```typescript
interface CartItem {
  productId: string;
  quantity: number;
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
```

#### Bad Example

```typescript
// Implicit any on items, reduce callback parameters, and return type
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
```

#### Exceptions

None.

---

### 1.3 strictNullChecks

#### Rule

All variables must be assumed to be potentially `null` or `undefined` unless
they are explicitly assigned a value or structured in a way that guarantees
existence. Unions containing `null` or `undefined` must be explicitly narrowed
using type guards or optional chaining before accessing properties.

#### Why this rule exists

"Cannot read properties of undefined (reading 'x')" is the most common runtime
error in JavaScript applications. `strictNullChecks` forces developers to
explicitly handle empty states, preventing production crashes.

#### Good Example

```typescript
interface UserProfile {
  name: string;
  phoneNumber?: string;
}

function formatPhone(profile: UserProfile): string {
  if (profile.phoneNumber === undefined) {
    return "No phone number provided";
  }
  return profile.phoneNumber.trim();
}
```

#### Bad Example

```typescript
interface UserProfile {
  name: string;
  phoneNumber?: string;
}

function formatPhone(profile: UserProfile): string {
  // Compiler error under strictNullChecks: profile.phoneNumber is possibly undefined
  return profile.phoneNumber.trim();
}
```

#### Exceptions

None.

---

### 1.4 exactOptionalPropertyTypes

#### Rule

Optional properties on types and interfaces must be defined as either present
with their declared type or completely absent. They cannot be explicitly
initialized or assigned a value of `undefined`.

#### Why this rule exists

By default, TypeScript allows `{ key: undefined }` to satisfy the type
`{ key?: string }`. However, `Object.keys()` and loop structures behave
differently when a key is present with a value of `undefined` versus when it is
completely absent. This rule enforces semantic alignment between typing and
runtime object structures.

#### Good Example

```typescript
interface ProductMetadata {
  tags?: string[];
}

// Correct: tag property is omitted entirely
const firstProduct: ProductMetadata = {
  tags: ["sneakers", "running"],
};
const secondProduct: ProductMetadata = {};
```

#### Bad Example

```typescript
interface ProductMetadata {
  tags?: string[];
}

// Error under exactOptionalPropertyTypes: Type undefined is not assignable to type string[]
const badProduct: ProductMetadata = {
  tags: undefined,
};
```

#### Exceptions

None.

---

### 1.5 noUncheckedIndexedAccess

#### Rule

When accessing keys of an index signature or dictionary object, the returned
type must automatically include `undefined`, forcing the developer to perform an
existence check before using the value.

#### Why this rule exists

Without this option, TypeScript assumes that reading any key from a record type
`Record<string, Product>` returns a valid `Product`. This is untrue at runtime
for keys that do not exist, leading to silent undefined references.

#### Good Example

```typescript
const productRegistry: Record<string, Product> = {};

function processProduct(id: string): void {
  const product = productRegistry[id]; // Type is Product | undefined
  if (product === undefined) {
    throw new Error(`Product ${id} not found in registry`);
  }
  console.log(product.name);
}
```

#### Bad Example

```typescript
const productRegistry: Record<string, Product> = {};

function processProduct(id: string): void {
  const product = productRegistry[id]; // Type incorrectly assumed to be Product without check
  console.log(product.name); // Runtime Crash if id is missing
}
```

#### Exceptions

Allowed inside utility scripts under the `/scripts` directory where
performance/verbosity trade-offs are less critical, though still discouraged.

---

## 2. Type Modeling & Declarations

### 2.1 unknown vs any

#### Rule

Use `unknown` for values whose type is not known at compile time (e.g., API
payloads, dynamic configurations, raw database results). The use of `any` is
strictly banned in all codebase sectors.

#### Why this rule exists

`any` completely bypasses compiler verification. It turns off type checking,
whereas `unknown` acts as a safe wrapper that forces the developer to perform
run-time type assertion or type checks before invoking operations on it.

#### Good Example

```typescript
export function parseIncomingPayload(rawJson: string): unknown {
  return JSON.parse(rawJson);
}

function processPayload(raw: unknown): void {
  if (raw !== null && typeof raw === "object" && "id" in raw) {
    // Narrowed scope securely
    console.log((raw as { id: string }).id);
  }
}
```

#### Bad Example

```typescript
// any allows unchecked, dangerous operations
export function parseIncomingPayload(rawJson: string): any {
  return JSON.parse(rawJson);
}

function processPayload(raw: any): void {
  console.log(raw.nonExistentMethod()); // Crash!
}
```

#### Exceptions

Allowed only when interfacing with raw third-party library callbacks that force
the type signature of `any` and do not allow overriding.

---

### 2.2 never

#### Rule

Use `never` to explicitly denote unreachable states or compile-time
exhaustiveness assertions in switch-cases and union types.

#### Why this rule exists

If a union is modified (e.g., adding an enum type), checking it against `never`
forces a compile-time build failure if any option is not explicitly handled in a
branch.

#### Good Example

```typescript
type UserRole = "admin" | "buyer" | "seller";

function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "buyer":
      return "/shop";
    case "seller":
      return "/dashboard";
    default: {
      const _exhaustiveCheck: never = role;
      return _exhaustiveCheck;
    }
  }
}
```

#### Bad Example

```typescript
type UserRole = "admin" | "buyer" | "seller";

function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "buyer":
      return "/shop";
    // Adding "seller" later is silently skipped, leading to a silent return of undefined
  }
  return "";
}
```

#### Exceptions

None.

---

### 2.3 type vs interface

#### Rule

Use `interface` for declaring the shape of objects, classes, and react component
props where extension (merging/inheritance) is expected. Use `type` for unions,
intersections, primitives, utility types, and mapped shapes.

#### Why this rule exists

TypeScript `interfaces` compile slightly faster because they support declaration
merging and compile-time index mapping caching. `types` are more expressive and
are the only way to construct complex patterns like unions (`A | B`) or
intersections (`A & B`).

#### Good Example

```typescript
// Object declarations
interface UserRepository {
  findById(id: string): Promise<User | null>;
}

// Complex declarations
type ID = string | number;
type ResponseStatus = "success" | "error";
```

#### Bad Example

```typescript
// Overusing type for standard extendable shapes
type UserType = {
  id: string;
  name: string;
};
```

#### Exceptions

None.

---

### 2.4 readonly

#### Rule

Declare type properties, array collections, and function parameters as
`readonly` by default. Mutability should be an opt-in decision.

#### Why this rule exists

Data mutability introduces state side-effects, making concurrency and rendering
(e.g., React states) unstable and hard to debug. Marking structures as
`readonly` leverages compiler-level protection against accidental mutation.

#### Good Example

```typescript
interface OrderItem {
  readonly productId: string;
  readonly price: number;
}

export function computeSubtotal(items: readonly OrderItem[]): number {
  // items.push(...) is prevented at compile time
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### Bad Example

```typescript
interface OrderItem {
  productId: string;
  price: number;
}

export function computeSubtotal(items: OrderItem[]): number {
  items[0].price = 10; // Mutation side effect allowed
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### Exceptions

Allowed when typing entities intended for database updates (like ORM entities)
where active in-place record mutations are expected before persisting.

---

### 2.5 const assertions

#### Rule

Use `as const` when defining literal configurations, design tokens, route paths,
or read-only arrays of strings.

#### Why this rule exists

`as const` informs the compiler to treat the shape as deeply immutable and
narrow type definitions to their literal values, rather than widening them to
strings or arrays.

#### Good Example

```typescript
export const API_ROUTES = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
} as const; // Type is exactly read-only paths, not generic strings
```

#### Bad Example

```typescript
export const API_ROUTES = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
}; // Type is widened to { LOGIN: string; LOGOUT: string }
```

#### Exceptions

None.

---

### 2.6 literal types

#### Rule

Use union literal types (`"active" | "inactive"`) instead of primitive types
(`string`, `number`) for values that are constrained to a predefined, static
domain.

#### Why this rule exists

Literal types allow the compiler to validate string assignments, preventing
typos from causing functional bugs.

#### Good Example

```typescript
type CheckoutStatus = "pending" | "processing" | "completed" | "failed";

interface Order {
  status: CheckoutStatus;
}
```

#### Bad Example

```typescript
interface Order {
  status: string; // "processng" typo cannot be caught by TypeScript
}
```

#### Exceptions

None.

---

### 2.7 enums vs const objects

#### Rule

Standard TypeScript `enum` declarations are prohibited. Use `as const` objects
instead.

#### Why this rule exists

TypeScript `enums` generate complex runtime IIFEs that do not tree-shake
cleanly. In contrast, `const` objects compile directly to native JavaScript
objects that bundlers can optimize.

#### Good Example

```typescript
export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
```

#### Bad Example

```typescript
// Banned pattern
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
}
```

#### Exceptions

None.

---

### 2.8 discriminated unions

#### Rule

When modeling states with mutually exclusive schemas, use discriminated unions
with a common literal property (e.g., `status` or `type`).

#### Why this rule exists

Discriminated unions allow TypeScript to perform type narrowing inside control
flow scopes, ensuring type safety when accessing variant-specific properties.

#### Good Example

```typescript
interface PaymentSuccess {
  readonly status: "success";
  readonly transactionId: string;
}

interface PaymentFailed {
  readonly status: "failed";
  readonly errorCode: string;
}

type PaymentResponse = PaymentSuccess | PaymentFailed;

function handlePayment(response: PaymentResponse) {
  if (response.status === "success") {
    console.log(response.transactionId); // Safe
  } else {
    console.log(response.errorCode); // Safe
  }
}
```

#### Bad Example

```typescript
interface PaymentResponse {
  status: "success" | "failed";
  transactionId?: string;
  errorCode?: string; // Requires optional checks everywhere, error-prone
}
```

#### Exceptions

None.

---

## 3. Advanced Type Construction

### 3.1 utility types

#### Rule

Leverage built-in utility types (`Pick`, `Omit`, `Partial`, `Record`,
`ReturnType`, `Parameters`) to transform existing types, rather than redeclaring
overlapping interfaces.

#### Why this rule exists

Redeclaring duplicate interfaces creates code duplication and leads to drift
when the source type is modified. Using utilities establishes a single source of
truth.

#### Good Example

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// Correct: creates update type based on Product model
export type UpdateProductInput = Partial<Omit<Product, "id">>;
```

#### Bad Example

```typescript
// Duplicating type properties manually
interface UpdateProductInput {
  name?: string;
  price?: number;
  stock?: number;
}
```

#### Exceptions

If the utility type nesting exceeds 3 levels of depth, declare a fresh interface
to preserve compiler speed and readability.

---

### 3.2 generic constraints

#### Rule

All generic parameters must be explicitly constrained using `extends` to
restrict acceptable type arguments to the expected domain. Unconstrained generic
types (`T`) are prohibited unless the logic is strictly type-agnostic (e.g.,
lists, queues).

#### Why this rule exists

Generic constraints allow the compiler to validate type structures within the
generic scope, preventing downstream runtime incompatibilities.

#### Good Example

```typescript
interface HasId {
  id: string;
}

export function findById<T extends HasId>(
  collection: T[],
  id: string
): T | undefined {
  return collection.find((item) => item.id === id); // Safe access to .id
}
```

#### Bad Example

```typescript
// Compilation fails: Property 'id' does not exist on type 'T'
export function findById<T>(collection: T[], id: string): T | undefined {
  return collection.find((item) => item.id === id);
}
```

#### Exceptions

None.

---

## 4. Function Architecture

### 4.1 function declaration vs arrow functions

#### Rule

Use **function declarations** (`export function fnName()...`) for top-level
utility functions, routes, and controllers. Use **arrow functions** for
callbacks, inline functions, closures, and React components where component
syntax benefits from arrow definition.

#### Why this rule exists

Function declarations promote readability, support function hoisting (meaning
helpers can be logically placed at the bottom of the file), and render clean
stack traces in debugging output.

#### Good Example

```typescript
export function computeDiscount(price: number, rate: number): number {
  return price * rate;
}
```

#### Bad Example

```typescript
export const computeDiscount = (price: number, rate: number): number => {
  return price * rate;
};
```

#### Exceptions

React component declarations can use arrow functions to align with React
rendering patterns.

---

### 4.2 async function naming

#### Rule

Do **not** use the `Async` suffix in function names. Use active verbs that
describe the operation, and rely on the return type (`Promise<T>`) to
communicate asynchronous execution.

#### Why this rule exists

Adding `Async` to function names creates clutter. The `Promise<T>` return
signature is explicitly tracked by the compiler and visible to IDEs, making
suffixes redundant.

#### Good Example

```typescript
export async function getProduct(id: string): Promise<Product> {
  const result = await db.query(id);
  return result;
}
```

#### Bad Example

```typescript
export async function getProductAsync(id: string): Promise<Product> {
  const result = await db.query(id);
  return result;
}
```

#### Exceptions

Allowed when writing integration layers that must match a legacy third-party
interface naming scheme.

---

### 4.3 return type guidelines

#### Rule

All exported functions must declare their return type explicitly. Inline helper
functions can rely on compiler inference if their implementation is trivial.

#### Why this rule exists

Explicit return types ensure that if the function implementation changes, any
signature changes are caught immediately at compile time. It also prevents leaks
of internal types to consumers.

#### Good Example

```typescript
export function calculateTax(amount: number): number {
  return amount * 0.15;
}
```

#### Bad Example

```typescript
// Return type is implicitly inferred, risking leakage or drift
export function calculateTax(amount: number) {
  return amount * 0.15;
}
```

#### Exceptions

Private internal helper functions that are not exported from their parent file.

---

## 5. Data Immutability & Value Semantics

### 5.1 object immutability

#### Rule

Use utility types like `Readonly<T>` or `ReadonlyArray<T>` to wrap objects and
arrays passed to functions. Avoid in-place state mutations. Use structural
sharing (spread operators) to update objects.

#### Why this rule exists

In-place mutations lead to silent, hard-to-trace side effects across
microservices and components.

#### Good Example

```typescript
interface UserState {
  readonly email: string;
  readonly isActive: boolean;
}

function activateUser(state: UserState): UserState {
  return { ...state, isActive: true }; // Structural sharing
}
```

#### Bad Example

```typescript
interface UserState {
  email: string;
  isActive: boolean;
}

function activateUser(state: UserState): UserState {
  state.isActive = true; // In-place mutation
  return state;
}
```

#### Exceptions

Allowed in internal performance-critical loops (e.g., parser implementation)
where garbage collector allocation from structural sharing degrades execution
performance.

---

### 5.2 optional properties

#### Rule

Optional properties on objects must represent fields that can be logically
absent. If a value exists but is empty, use empty structures or null values
instead.

#### Why this rule exists

Ambiguity between `null`, `undefined`, and missing properties leads to defensive
code blocks and bugs.

#### Good Example

```typescript
interface UserProfile {
  name: string;
  middleName: string | null; // Explicit empty state
  nickname?: string; // Optional (may be absent)
}
```

#### Bad Example

```typescript
interface UserProfile {
  name?: string;
  middleName?: string; // Ambiguous: represents undefined or empty
}
```

#### Exceptions

None.

---

### 5.3 nullable values

#### Rule

Prefer using `null` for values that are explicitly set as empty or unknown by
the database or API. Use `undefined` exclusively for optional variables or
missing parameters.

#### Why this rule exists

Aligns TypeScript type definitions with PostgreSQL/databases where database NULL
translates to `null`. Aligns optional JavaScript properties with `undefined`.

#### Good Example

```typescript
interface Product {
  id: string;
  deletedAt: Date | null; // Database NULL
  description?: string; // Optional property
}
```

#### Bad Example

```typescript
interface Product {
  id: string;
  deletedAt: Date | undefined; // Mismatch with DB layer
}
```

#### Exceptions

None.

---

## 6. Architecture & Dependency Design

### 6.1 module organization

#### Rule

Separate your packages logically. Keep files grouped by concerns (e.g., routes,
controllers, services, models). Do not expose internal structures to external
packages.

#### Why this rule exists

Prevents implementation leaking, enforces architectural layers, and improves the
speed of compile-time dependency checks.

---

### 6.2 import ordering

#### Rule

Imports must be sorted into defined groups using the standard ESLint flat
config.

#### Why this rule exists

Eliminates code review discussions on import formats and prevents merge
conflicts on import blocks.

---

### 6.3 barrel exports (when to use and when to avoid)

#### Rule

Use barrel exports (`index.ts` files) only at package or library boundaries
(e.g., `packages/types/src/index.ts`). **Never** use barrel exports inside
application source trees (e.g., `client/apps/web/src/components/index.ts`).

#### Why this rule exists

Overusing barrel exports in application directories causes circular dependencies
and breaks build tree-shaking, resulting in large bundle sizes.

#### Good Example

```typescript
// packages/types/src/index.ts
export * from "./entities/Product.js";
```

#### Bad Example

```typescript
// client/apps/web/src/components/index.ts
export * from "./Header";
export * from "./Footer"; // Increases circular dependency risk
```

#### Exceptions

None.

---

### 6.4 folder organization

#### Rule

All source directories must follow a flat structure where concerns are
separated:

```
src/
├── controllers/
├── services/
├── models/
├── routes/
└── index.ts
```

#### Why this rule exists

Enforces a consistent layout across all 15+ backend microservices, allowing any
engineer to navigate different codebases easily.

---

### 6.5 file naming

#### Rule

Use `kebab-case` naming for source files. Files containing React components must
use `PascalCase.tsx`.

#### Why this rule exists

Prevents casing resolution issues between operating systems (e.g.,
case-sensitive Linux servers vs case-insensitive macOS local machines).

#### Good Example

```
product-controller.ts
MuiThemeProvider.tsx
```

#### Bad Example

```
productController.ts
mui-theme-provider.tsx
```

#### Exceptions

None.

---

### 6.6 naming conventions

#### Rule

- Variables and functions: `camelCase`
- Classes, Types, Interfaces: `PascalCase`
- Constants and config values: `UPPER_SNAKE_CASE`

#### Why this rule exists

Aligns standard coding styles with industry conventions and makes variable types
immediately identifiable.

---

### 6.7 dependency direction

#### Rule

Dependencies must flow from higher-level tiers to lower-level tiers:

```
client/apps -> client/packages -> packages
server/services -> server/packages -> packages
```

#### Why this rule exists

Prevents circular dependency paths and keeps code separation clean.

---

### 6.8 avoiding circular dependencies

#### Rule

Do not create circular imports between packages or files. Use dependency
inversion or extract shared logic into a separate package.

#### Why this rule exists

Circular dependencies cause runtime execution deadlocks and prevent compiler
optimization.

---

## 7. Code Quality & Standards

### 7.1 comments and documentation

#### Rule

Code should be self-documenting. Use comments to explain **why** code was
written, not **what** it does.

#### Why this rule exists

"What" comments quickly become out-of-date and redundant. "Why" comments capture
the business or technical context that cannot be inferred from the code.

#### Good Example

```typescript
// We use a retry limit of 3 to prevent API gateway timeouts
const RETRY_LIMIT = 3;
```

#### Bad Example

```typescript
// Set retry limit to 3
const RETRY_LIMIT = 3;
```

---

### 7.2 JSDoc rules

#### Rule

Use JSDoc comments for all exported API signatures, interfaces, and packages.

#### Why this rule exists

JSDoc integrates directly with IDEs, providing context to downstream consumers.

#### Good Example

```typescript
/**
 * Calculates the total cost of items in the cart.
 * @param items List of cart items to compute.
 * @returns The total cost.
 */
export function calculateTotal(items: CartItem[]): number { ... }
```

---

### 7.3 code complexity

#### Rule

Cyclomatic complexity per function must not exceed 10. Avoid deeply nested `if`
statements or nested loops.

#### Why this rule exists

High cyclomatic complexity makes code hard to test and reason about.

---

### 7.4 maximum function size

#### Rule

Functions must not exceed 50 lines of code.

#### Why this rule exists

Promotes single-responsibility functions that are easy to test.

---

### 7.5 maximum file size

#### Rule

Source files must not exceed 300 lines of code.

#### Why this rule exists

Enforces modular file structure.

---

### 7.6 dead code prevention

#### Rule

Dead code, unused variables, and unused imports are prohibited and will block
local commits.

#### Why this rule exists

Keeps the repository clean and prevents codebase bloat.

---

## 8. Operational Safety

### 8.1 error handling principles

#### Rule

Do not use `throw` for normal flow control. Catch generic errors and map them to
typed, structured error classes.

#### Why this rule exists

Generic error strings lead to unstable API error handling.

---

### 8.2 performance considerations

#### Rule

Avoid over-engineering types with excessive utility nesting.

#### Why this rule exists

Deeply nested utility types slow down compiler speeds.

---

### 8.3 tree shaking considerations

#### Rule

Do not use barrel exports in application files. Avoid standard enums.

#### Why this rule exists

Ensures build targets only bundle imported methods.

---

### 8.4 lint integration

#### Rule

Linter violations are treated as compiler warnings/errors and block the CI
pipeline.

#### Why this rule exists

Enforces code standards automatically.

---

### 8.5 testing considerations

#### Rule

Write tests for every helper and utility function.

#### Why this rule exists

Ensures logic stays working.

---

## 9. Synthesis & Reference

### 9.1 common anti-patterns

- Using type assertions (`as Type`) instead of validation.
- Overusing type castings.

### 9.2 FAQ

- **Why can't I use enums?** Because they do not compile to clean JavaScript and
  are not tree-shakeable.
- **Why do we enforce NodeNext?** Because backend services use native Node.js
  ESM.

### 9.3 decision summary

A summary table of all decisions made.

| Option      | Chosen | Why               |
| ----------- | ------ | ----------------- |
| strict mode | True   | Type safety       |
| any type    | Banned | Bypasses compiler |

### 9.4 revision checklist

- Run `pnpm typecheck`
- Run `pnpm lint`
