# CommerSync Naming Conventions Handbook

> **Document Status:** Approved  
> **Version:** 1.0.0  
> **Audience:** All Engineers, Staff Engineers, Tech Leads, SREs, New Hires  
> **Applies To:** Entire CommerSync Platform (Applications, Services, Packages,
> Infrastructure)

---

## Executive Summary

Naming is the single most important component of codebase readability. In a
monorepo containing 15+ backend microservices, multiple frontend applications,
and shared configurations, a lack of clear standards leads to cognitive
friction, high onboarding costs, and duplicate implementations.

This handbook establishes the naming conventions for CommerSync. Every file,
directory, variable, function, class, type, API endpoint, database schema,
event, and docker container must comply with these guidelines.

---

## 1. General Naming Principles

### 1.1 Consistency over Personal Preference

#### Rule

Adhere to the established conventions in this document even if you disagree with
them or prefer a different style.

#### Why this rule exists

A large-scale codebase is written by many developers but must read like it was
written by a single person. Consistency reduces cognitive load and allows
engineers to switch between subsystems without adapting to different styles.

#### Good Example

Naming a configuration class `AppConfig` across all backend services because it
is the repository standard.

#### Bad Example

Naming it `AppConfiguration` in the auth service and `Config` in the product
service because of individual engineer preferences.

---

### 1.2 Readability over Brevity

#### Rule

Prefer descriptive, clear names over short, cryptic names. Do not sacrifice
clarity to save keystrokes.

#### Why this rule exists

Modern IDEs feature autocomplete, making typing length a non-issue. Code is read
far more often than it is written; clear names reveal intent immediately.

#### Good Example

`calculateTotalOrderPriceWithTax(order)`

#### Bad Example

`calcTot(o)`

---

### 1.3 Business Terminology (Ubiquitous Language)

#### Rule

Names must align with the business domain terms defined in the product
specification (Domain-Driven Design).

#### Why this rule exists

Using the same terms across product requirements, code interfaces, APIs, and
database schemas ensures that business context is preserved and prevents
translation errors between product managers and engineers.

#### Good Example

Using `Cart` and `CartItem` if the product specification calls it a "Cart"
rather than a "Basket".

#### Bad Example

Using `ShoppingBasket` in the frontend and `Cart` in the backend API.

---

### 1.4 Avoid Abbreviations

#### Rule

Abbreviations are prohibited unless they are globally accepted industry
standards (e.g., `id`, `url`, `http`, `uuid`, `dto`, `api`, `env`, `db`).

#### Why this rule exists

Non-standard abbreviations are ambiguous and create friction for new hires or
engineers from other domains.

#### Good Example

`productRepository`, `context`

#### Bad Example

`prodRepo`, `ctx`

---

### 1.5 Avoid Ambiguous Words

#### Rule

Do not use generic, ambiguous words like `data`, `info`, `manager`, `process`,
or `helper` as suffixes or prefixes in names.

#### Why this rule exists

These words are placeholders that do not explain the responsibility or behavior
of the variable or class.

#### Good Example

`userProfile`, `PaymentProcessor`, `S3FileUploader`

#### Bad Example

`userData`, `UserInfo`, `Helper`, `ProcessManager`

---

## 2. File Naming

### 2.1 File Casing Guide

We enforce standard case formats for different types of files:

| Casing Format        | Description                              | Applied To                                                          | Example                                   |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| **kebab-case**       | All lowercase with hyphens               | Standard TypeScript files, utilities, tests, configs, documentation | `auth-service.ts`, `eslint.config.mjs`    |
| **PascalCase**       | Capitalized words, no separators         | React components, providers, layout components                      | `ProductCard.tsx`, `MuiThemeProvider.tsx` |
| **camelCase**        | First word lowercase, others capitalized | React custom hooks                                                  | `useProducts.ts`                          |
| **UPPER_SNAKE_CASE** | All uppercase with underscores           | Environment variable template files                                 | `.env.production`                         |

#### Rule for TypeScript Files

Standard TypeScript files must use `kebab-case`.

- **Why:** Prevents filesystem case-sensitivity mismatches between development
  machines (macOS) and production deployment runners (Linux).
- **Good:** `product-repository.ts`
- **Bad:** `ProductRepository.ts`, `productRepository.ts`

#### Rule for React Components

Files containing React components must use `PascalCase.tsx`.

- **Why:** Immediately distinguishes component files from utility or service
  files.
- **Good:** `Header.tsx`
- **Bad:** `header.tsx`, `header-component.tsx`

#### Rule for Next.js Pages & Layouts

Next.js App Router folders and special files must follow the Next.js framework
standards.

- **Why:** Next.js uses convention-over-configuration routing.
- **Good:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

#### Rule for Route Handlers

Next.js API route handler files must be named `route.ts`.

- **Why:** Enforced by the Next.js routing convention.
- **Good:** `route.ts`

#### Rule for Hooks

React custom hooks must use `camelCase` and start with the `use` prefix.

- **Why:** Aligns with React's built-in hooks convention.
- **Good:** `useCart.ts`
- **Bad:** `CartHook.ts`, `use-cart.ts`

#### Rule for Utilities, Services, Controllers, Middleware, Repositories, DTOs, Validators, and Schemas

Non-component TypeScript files must use `kebab-case` and include a suffix
denoting their architectural role:

- **Good:** `auth.controller.ts`, `product.service.ts`, `user.repository.ts`,
  `create-product.dto.ts`, `payment.middleware.ts`, `auth.validator.ts`
- **Bad:** `authController.ts`, `ProductService.ts`

#### Rule for Configuration Files

Configuration files must be named `<tool>.config.<ext>`.

- **Why:** Standardizes configuration discovery.
- **Good:** `tailwind.config.ts`, `vite.config.ts`

#### Rule for Markdown Documentation

Markdown files must use uppercase letters for core documentation (like
`README.md`) and `kebab-case` for architectural document guides.

- **Good:** `README.md`, `01-project-philosophy.md`

---

## 3. Folder Naming

### 3.1 Folder Structure Boundaries

We define strict casing rules for directories depending on their tier:

| Tier / Directory | Case Format                              | Example                         |
| ---------------- | ---------------------------------------- | ------------------------------- |
| **apps/**        | `kebab-case`                             | `client/apps/web/`              |
| **packages/**    | `kebab-case`                             | `packages/validators/`          |
| **features/**    | `kebab-case`                             | `src/features/product-catalog/` |
| **components/**  | `kebab-case`                             | `src/components/`               |
| **routes/**      | Next.js dynamic routing / Express naming | `src/app/api/products/[id]/`    |

#### Rule for Package/App Directories

Directories under `apps/` and `packages/` must use `kebab-case`.

- **Why:** Standardizes paths inside the monorepo workspace.
- **Good:** `server/services/auth-service`
- **Bad:** `server/services/authService`

#### Rule for Shared/Domain Directories

Shared configuration folders and architectural domain directories must use
`kebab-case`.

- **Good:** `src/shared-components/`, `src/domain-logic/`

---

## 4. Variable Naming

### 4.1 Boolean Variables

#### Rule

Boolean variables must be prefixed with `is`, `has`, `should`, `can`, or `was`.

#### Why this rule exists

Explicit prefixes turn variable declarations into readable assertions, resolving
ambiguity about whether a variable contains a state flag or an object.

#### Good Examples

- `isActive`
- `hasPermission`
- `shouldRetry`
- `canDelete`

#### Bad Examples

- `active` (ambiguous)
- `permission` (sounds like an object or string)
- `retry` (sounds like a function or count)

---

### 4.2 Arrays and Collections

#### Rule

Arrays, lists, and collections must use plural nouns or the `List` / `Map` /
`Set` suffixes when the structure warrants clarification.

#### Why this rule exists

Plurals make it immediately obvious that the variable holds multiple elements,
preventing signature mismatches during iteration.

#### Good Examples

- `products`
- `userList`
- `orderById` (indicates a map lookup key)

#### Bad Examples

- `product` (for a list of products)
- `userArray` (redundant implementation type detail)

---

### 4.3 Promises and Async Results

#### Rule

Do not suffix variables containing promises with `Promise`. Treat them as the
values they will eventually resolve to.

#### Good Examples

- `user` (resolved value)
- `token`

#### Bad Examples

- `userPromise`

---

### 4.4 Constants

#### Rule

Literal configurations, magic numbers, static configurations, and constants must
use `UPPER_SNAKE_CASE`.

#### Good Examples

- `MAX_RETRIES = 5`
- `API_TIMEOUT_MS = 3000`

#### Bad Examples

- `maxRetries = 5`

---

## 5. Function Naming

### 5.1 Function Prefix Vocabulary

Use specific verbs to declare the exact intent of the function:

| Verb         | Action                                                 | Example                 |
| ------------ | ------------------------------------------------------ | ----------------------- |
| **get**      | Synchronously retrieve an in-memory property/state     | `getUserProfile()`      |
| **fetch**    | Asynchronously retrieve data from an API/remote source | `fetchProductCatalog()` |
| **create**   | Instantiate a new instance or database record          | `createOrderRecord()`   |
| **build**    | Assemble a complex object using builders/mappers       | `buildProductDto()`     |
| **validate** | Perform logical checks returning boolean or throwing   | `validateEmailInput()`  |
| **format**   | Transform a value into a specific string presentation  | `formatCurrencyValue()` |
| **parse**    | Convert raw data into a typed model                    | `parseJwtHeader()`      |
| **map**      | Translate one model type into another                  | `mapUserToDto()`        |
| **handle**   | React to an event callback or routing entry            | `handleSubmitClick()`   |

#### Rule for React Hooks

Custom React hooks must use camelCase and start with the `use` prefix.

- **Good:** `useCart()`
- **Bad:** `getCart()`

#### Rule for Async Functions

Asynchronous functions returning a Promise must use active verbs and must not
use the `Async` suffix.

- **Good:** `fetchOrders()`
- **Bad:** `fetchOrdersAsync()`

---

## 6. Class Naming

### 6.1 Class Suffixes

#### Rule

Classes must use `PascalCase` and must be suffixed with their architectural
role: `Service`, `Controller`, `Repository`, `Factory`, `Strategy`, `Adapter`,
`Provider`, `Client`, `Builder`, `Guard`.

#### Why this rule exists

Standardizing suffixes allows engineers to immediately identify the
responsibility of the class within our layered architecture.

#### Good Examples

- `ProductService`
- `AuthController`
- `UserRepository`
- `PaymentGatewayAdapter`

#### Bad Examples

- `ProductHelper`
- `AuthLogic`
- `DBUser`

---

## 7. Interface and Type Naming

### 7.1 Interface Prefixes

#### Rule

Do **not** use the `I` prefix for interfaces. Declare the entity name directly.

#### Why this rule exists

The `I` prefix is a legacy convention from C++ and C# that is redundant in
modern TypeScript. Developers should care about the shape and contract of the
object, not whether it is implemented as an interface or a type alias.

#### Good Example

```typescript
interface ProductRepository {
  findById(id: string): Promise<Product | null>;
}
```

#### Bad Example

```typescript
interface IProductRepository {
  findById(id: string): Promise<Product | null>;
}
```

---

### 7.2 Suffixes for Data Contracts

#### Rule

Data contracts must use explicit suffixes depending on their purpose:

- **DTOs:** `Dto` (e.g., `CreateProductDto`)
- **API Requests:** `Request` (e.g., `UpdateUserRequest`)
- **API Responses:** `Response` (e.g., `LoginResponse`)
- **Domain Events:** `Event` (e.g., `OrderCreatedEvent`)
- **React Props:** `Props` (e.g., `ButtonProps`)
- **React State:** `State` (e.g., `CartState`)
- **React Context:** `Context` (e.g., `ThemeContext`)

#### Good Examples

- `CreateOrderDto`
- `ProductListResponse`
- `HeaderProps`

#### Bad Examples

- `OrderData`
- `ProductsList`

---

## 8. React Naming

### 8.1 React Components & State

#### Rule

- Components must use `PascalCase`.
- Providers must use `<Name>Provider`.
- Context values must use `camelCase` state variables and set functions must use
  the `set` prefix.

#### Good Example

```tsx
const [cartItems, setCartItems] = useState<CartItem[]>([]);
```

#### Bad Example

```tsx
const [items, updateItems] = useState<CartItem[]>([]);
```

---

## 9. API Naming

### 9.1 REST Endpoint Design

#### Rule

REST resource endpoints must be lowercase, use plural nouns for resources, and
use kebab-case for multi-word paths. Always place parameters behind the resource
scope.

#### Why this rule exists

Ensures the API is predictable, resource-oriented, and follows industry
standards.

#### Good Examples

- `GET /api/v1/products`
- `GET /api/v1/products/{id}`
- `GET /api/v1/users/{id}/addresses`

#### Bad Examples

- `POST /api/v1/getProduct`
- `GET /api/v1/product/{id}`
- `GET /api/v1/user_addresses`

---

## 10. Database Naming

### 10.1 Postgres vs. TypeScript Casing

#### Rule

- Database tables, columns, indexes, constraints, and sequences must use
  `snake_case` in PostgreSQL.
- Prisma models must use `PascalCase` and mapping attributes to match
  `snake_case` column targets.

#### Why this rule exists

PostgreSQL treats unquoted identifiers as lowercase by default. Using
`camelCase` in PostgreSQL queries requires surrounding all table and column
names with double quotes, which adds unnecessary visual noise.

Using Prisma's `@map` attribute bridges PostgreSQL's `snake_case` with
TypeScript's standard `camelCase`.

#### Good Example (Prisma Schema)

```prisma
model OrderDetail {
  id        String   @id @default(uuid())
  orderId   String   @map("order_id")
  productId String   @map("product_id")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("order_details")
}
```

#### Bad Example (Prisma Schema)

```prisma
// Missing mappings, forcing CamelCase in PostgreSQL
model OrderDetail {
  id        String   @id
  orderId   String
  productId String
}
```

---

## 11. Event Naming

### 11.1 Message Queue Topics and Payloads

#### Rule

- Kafka topics and RabbitMQ routing keys must use `kebab-case` or dot-separated
  paths in lowercase: `<domain>.<resource>.<action>`.
- Domain event names must use past tense verbs: `OrderCreated`, `PaymentFailed`.

#### Good Examples

- Kafka topic: `order-service.orders`
- Event name: `order.created` or `OrderCreated`

#### Bad Examples

- Kafka topic: `orderCreatedTopic`
- Event name: `createOrder` (sounds like a command/action)

---

## 12. Environment Variables

### 12.1 Format and Scope

#### Rule

Environment variables must use `UPPER_SNAKE_CASE` and be prefixed with their
scope if they represent configuration flags or client-exposed variables.

#### Good Examples

- `DATABASE_URL`
- `NEXT_PUBLIC_API_URL`
- `FEATURE_NEW_CHECKOUT`

#### Bad Examples

- `databaseUrl`
- `NextPublicApiUrl`

---

## 13. Docker & Kubernetes Naming

### 13.1 Infrastructure Identifiers

#### Rule

- Docker images, container names, and Compose services must use `kebab-case`.
- Kubernetes namespaces, deployments, services, ingress, and configmaps must use
  `kebab-case`.

#### Good Examples

- `auth-service-container`
- `commersync-dev-namespace`

#### Bad Examples

- `authServiceContainer`
- `commersync_dev`

---

## 14. Git Naming

### 14.1 Branches, Commits, and Tags

#### Rule

- Git branches must follow: `<type>/<author>/<description>` in lowercase.
- Commits must follow Conventional Commits format.
- Release tags must use semantic versioning with a `v` prefix.

#### Good Examples

- Branch: `feature/tarun/auth-refresh-token`
- Commit: `feat(auth): add token verification middleware`
- Tag: `v1.4.0`

#### Bad Examples

- Branch: `tarun-auth-fix`
- Commit: `fixed auth token bug`
- Tag: `release-1.4`

---

## 15. Testing Naming

### 15.1 Suites and Cases

#### Rule

- Test files must be suffixed with `.test.ts` or `.spec.ts`.
- Test suites (`describe` blocks) must match the class or utility name.
- Test cases (`it` or `test` blocks) must use active verbs describing expected
  behavior.

#### Good Example

```typescript
describe("ProductService", () => {
  describe("getProductById", () => {
    it("should return the product when a valid ID is provided", async () => { ... });
  });
});
```

#### Bad Example

```typescript
describe("product service test", () => {
  test("test 1", () => { ... });
});
```

---

## 16. Anti-Patterns

### 16.1 Redundant Context Naming

- **Poor:** `interface Product { productName: string; productPrice: number; }`
- **Improved:** `interface Product { name: string; price: number; }`
- **Why:** Suffixing property names with the entity name adds redundant context.

### 16.2 Hungarian Notation

- **Poor:** `const sUsername = "tarun"; const nRetryCount = 3;`
- **Improved:** `const username = "tarun"; const retryCount = 3;`
- **Why:** TypeScript's compiler tracks variable types automatically. Prefixes
  like `s` or `n` are obsolete.

### 16.3 Non-Standard Suffixes

- **Poor:** `class UserDataHelper`
- **Improved:** `class UserService`

---

## 17. Decision Matrix

| Category             | Convention                           | Good Example                |
| -------------------- | ------------------------------------ | --------------------------- |
| **TypeScript Files** | `kebab-case.ts`                      | `product-service.ts`        |
| **React Components** | `PascalCase.tsx`                     | `ProductCard.tsx`           |
| **Variable Names**   | `camelCase`                          | `isUserActive`              |
| **Boolean Flags**    | Prefix: `is`, `has`, `should`, `can` | `hasPermission`             |
| **Constant Values**  | `UPPER_SNAKE_CASE`                   | `MAX_RETRY_LIMIT`           |
| **Database Tables**  | `snake_case`                         | `order_details`             |
| **REST Endpoints**   | Lowercase plural nouns               | `/api/v1/orders`            |
| **Kafka Topics**     | Lowercase separated                  | `order-service.orders`      |
| **Git Branches**     | `<type>/<author>/<description>`      | `feature/tarun/oauth-login` |

---

## 18. Quick Reference Cheat Sheet

- **TypeScript Casing:** Variables and functions are `camelCase`. Types and
  classes are `PascalCase`. Constants are `UPPER_SNAKE_CASE`. Files are
  `kebab-case.ts`.
- **React Casing:** Component files and names are `PascalCase`. Custom hooks are
  `useCamelCase.ts`.
- **Database mapping:** PostgreSQL columns are `snake_case`. Prisma models map
  fields to camelCase for TS codebases.
- **Prefixes:** Never use `I` for interfaces. Booleans must have verbs (`is`,
  `has`).

---

## 19. FAQ

### Q: Why can't we use standard TypeScript `enums`?

TypeScript `enums` generate custom IIFE wrapper functions that prevent build
tools from tree-shaking unused properties, increasing client-side bundles. Use
`as const` objects instead.

### Q: Why should we use kebab-case for file names?

Some operating systems (like macOS) are case-insensitive, while others (like
Linux) are case-sensitive. Using camelCase or PascalCase for files can cause
compilation to pass locally but fail on Linux build machines due to import
character mismatches. Kebab-case avoids this mismatch entirely.
