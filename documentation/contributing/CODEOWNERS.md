# =============================================================================

# CommerSync — CODEOWNERS

# =============================================================================

# GitHub evaluates rules TOP TO BOTTOM. For any given file, the LAST matching

# pattern wins — not the most specific one, the last one written in the file.

# This file is therefore ordered deliberately:

# 1. Global default (broadest, top)

# 2. Domain/directory ownership (root-level teams)

# 3. Service-level overrides (most specific, bottom)

# Never insert a new rule "wherever it fits topically" — always insert it

# AFTER any broader rule it needs to override.

# =============================================================================

# -----------------------------------------------------------------------------

# 0. GLOBAL DEFAULT OWNER

# -----------------------------------------------------------------------------

# Fallback owner for anything not explicitly matched below. Keeps the

# architecture team as a safety net so nothing merges with zero review.

- @architecture-team

# -----------------------------------------------------------------------------

# 1. REPOSITORY ROOT — config, tooling, monorepo files

# -----------------------------------------------------------------------------

/_.json @platform-team
/_.yaml @platform-team
/_.yml @platform-team
/turbo.json @platform-team
/package.json @platform-team
/pnpm-workspace.yaml @platform-team
/tsconfig_.json @platform-team
/.eslintrc* @platform-team
/.prettierrc* @platform-team
/README.md @architecture-team @documentation-team
/LICENSE @architecture-team

# -----------------------------------------------------------------------------

# 2. BACKEND — /server/

# -----------------------------------------------------------------------------

/server/ @backend-team

# Domain-specific overrides (add new services below this line as they land)

/server/auth/ @backend-team @security-team
/server/users/ @backend-team
/server/products/ @backend-team
/server/categories/ @backend-team
/server/inventory/ @backend-team
/server/cart/ @backend-team
/server/checkout/ @backend-team
/server/orders/ @backend-team
/server/payments/ @backend-team @security-team
/server/shipping/ @backend-team
/server/notifications/ @backend-team
/server/analytics/ @backend-team
/server/search/ @backend-team
/server/gateway/ @backend-team @platform-team
/server/workers/ @backend-team @platform-team
/server/events/ @backend-team @platform-team

# -----------------------------------------------------------------------------

# 3. FRONTEND — /client/

# -----------------------------------------------------------------------------

/client/ @frontend-team

/client/apps/ @frontend-team
/client/design-system/ @frontend-team
/client/shared-ui/ @frontend-team
/client/hooks/ @frontend-team
/client/utils/ @frontend-team
/client/types/ @frontend-team
/client/validators/ @frontend-team

# -----------------------------------------------------------------------------

# 4. SHARED PACKAGES — /packages/

# -----------------------------------------------------------------------------

# Root fallback: unclaimed packages default to platform team until a package

# owner is explicitly assigned below.

/packages/ @platform-team

/packages/auth-sdk/ @backend-team @security-team
/packages/ui-kit/ @frontend-team
/packages/event-bus/ @backend-team @platform-team
/packages/config/ @platform-team
/packages/logger/ @platform-team
/packages/types/ @architecture-team

# -----------------------------------------------------------------------------

# 5. INFRASTRUCTURE

# -----------------------------------------------------------------------------

/docker/ @devops-team
/infrastructure/ @devops-team
/terraform/ @devops-team
/awsData/ @devops-team

# -----------------------------------------------------------------------------

# 6. GITHUB / CI-CD

# -----------------------------------------------------------------------------

/.github/ @devops-team
/.github/workflows/ @devops-team @platform-team
/.github/ISSUE_TEMPLATE/ @documentation-team
/.github/PULL_REQUEST_TEMPLATE.md @architecture-team
/.github/CODEOWNERS @architecture-team

# -----------------------------------------------------------------------------

# 7. DOCUMENTATION — /docs/

# -----------------------------------------------------------------------------

/docs/ @documentation-team

/docs/architecture/ @architecture-team @documentation-team
/docs/handbooks/ @documentation-team
/docs/api/ @backend-team @documentation-team
/docs/contributing/ @documentation-team

# -----------------------------------------------------------------------------

# 8. SCRIPTS — /scripts/

# -----------------------------------------------------------------------------

/scripts/ @platform-team

/scripts/build/ @platform-team
/scripts/tooling/ @platform-team
/scripts/migrations/ @backend-team @platform-team

# =============================================================================

# EXTENDING THIS FILE (read before adding new services)

# =============================================================================

# New backend service, e.g. /server/loyalty/ → add ONE line under Section 2:

# /server/loyalty/ @backend-team

#

# New frontend app, e.g. /client/apps/seller-portal/ → add under Section 3:

# /client/apps/seller-portal/ @frontend-team

#

# New shared package → add under Section 4, don't rely on the /packages/

# fallback for anything long-lived — explicit ownership prevents silent

# orphaning as the monorepo grows past 20+ services.

# =============================================================================
