# CommerSync — Phase 1 Action Plan

> **Generated:** July 8, 2026
> **Based On:** [PHASE_1_AUDIT_REPORT.md](file:///Users/Projects/CommerSync/PHASE_1_AUDIT_REPORT.md)
> **Goal:** Align repository with the Phase 1 Repository Foundation specifications.

---

## Task Summary

| Priority                                        | Count  | Estimated Effort |
| ----------------------------------------------- | ------ | ---------------- |
| 🔴 Critical (must complete before Phase 2)      | 6      | ~3 hours         |
| 🟡 Recommended (should complete before Phase 2) | 4      | ~2 hours         |
| **Total**                                       | **10** | **~5 hours**     |

---

## 🔴 Critical — Must Complete Before Phase 2

---

### Task C1: Remove Tracked `.DS_Store` Files

- **Goal:** Untrack macOS Finder metadata files that were committed to the repository and ensure they are ignored in the future.
- **Why it is required:** Tracked `.DS_Store` files create diff noise and clutter developer environments.
- **Files/Folders affected:** `client/.DS_Store`, `client/apps/.DS_Store`, `client/packages/.DS_Store`
- **Detailed steps:**
  1. Run `git rm --cached` on all tracked `.DS_Store` files.
  2. Commit the removal with a descriptive message.
  3. Verify that the files are no longer tracked while keeping the local `.gitignore` rules active.
- **Verification:** Running `git ls-files | grep DS_Store` returns no results.

---

### Task C2: Remove AWS Account ID from Source Control

- **Goal:** Replace the hardcoded AWS Account ID with a dynamic GitHub Secret reference.
- **Why it is required:** Security best practices require that cloud account identifiers are not exposed in plaintext within the codebase.
- **Files/Folders affected:** `docker-build.yml`
- **Detailed steps:**
  1. Locate the `AWS_ACCOUNT_ID` variable in `docker-build.yml`.
  2. Replace the hardcoded value `${{ secrets.AWS_ACCOUNT_ID }}` with a GitHub repository secret syntax.
  3. Add the value `${{ secrets.AWS_ACCOUNT_ID }}` to the GitHub Secrets configuration of the repository.
- **Verification:** Running a global grep search for the ID returns zero matches in the source files.

---

### Task C3: Establish Trunk-Based Branch Strategy

- **Goal:** Adopt a trunk-based development branching model centered around `main` as the default branch.
- **Why it is required:** The current repository structure relies on `master` and `dev` branches, creating branching ambiguity and merge skew.
- **Files/Folders affected:** GitHub repository settings, local repository configuration.
- **Detailed steps:**
  1. Rename the default branch from `master` to `main` in GitHub and locally.
  2. Document the trunk-based workflow in `docs/contributing/BRANCH_STRATEGY.md` (defining feature branch patterns, merge processes, and branch lifecycles).
  3. Retire or merge the `dev` branch to establish `main` as the single source of truth.
- **Verification:** The default branch on GitHub is `main`. `docs/contributing/BRANCH_STRATEGY.md` exists and matches trunk-based patterns.

---

### Task C4: Configure GitHub Branch Protection

- **Goal:** Enforce quality gates on the default branch through technical policies.
- **Why it is required:** Direct pushes and unreviewed merges allow unverified code to enter the repository.
- **Files/Folders affected:** GitHub Repository Settings
- **Detailed steps:**
  1. Add a branch protection rule/ruleset for the `main` branch.
  2. Enable "Require a pull request before merging" and set the minimum approvals to 1.
  3. Enable "Require approval of the most recent reviewable push" (dismiss stale approvals).
  4. Enable "Require branches to be up to date before merging" (prevent merge skew).
  5. Enforce "Squash merging" as the only allowed merge method to maintain a clean history.
- **Verification:** Pushing directly to `main` fails. Merging without approval is blocked.

---

### Task C5: Adopt Conventional Commits

- **Goal:** Establish a structured commit message format to allow readability, searchability, and future automation.
- **Why it is required:** The current history uses freeform messages that do not explain what changed or why.
- **Files/Folders affected:** `docs/contributing/COMMIT_CONVENTION.md`
- **Detailed steps:**
  1. Create `docs/contributing/COMMIT_CONVENTION.md` adopting the Conventional Commits v1.0.0 standard.
  2. Define specific scopes relevant to CommerSync (e.g., `repo`, `docs`, `infra`, `auth`, `product`).
  3. Provide examples of valid and invalid commit messages.
- **Verification:** Document exists. All new commits follow the conventional style.

---

### Task C6: Create Pull Request Template

- **Goal:** Build a standardized description template that auto-populates for new pull requests.
- **Why it is required:** Reviewers require consistent context (what, why, how, testing evidence) to perform reviews efficiently.
- **Files/Folders affected:** `.github/pull_request_template.md`
- **Detailed steps:**
  1. Create the `.github/` directory if it does not exist.
  2. Create `pull_request_template.md` with sections for Description, Motivation, Changes, Testing, and a pre-merge checklist.
- **Verification:** Creating a test PR on GitHub auto-populates the template.

---

## 🟡 Recommended — Should Complete Before Phase 2

---

### Task R1: Implement CODEOWNERS File

- **Goal:** Configure automatic reviewer routing based on directory paths.
- **Why it is required:** Large monorepos require code reviews to be routed automatically to the correct domain experts.
- **Files/Folders affected:** `.github/CODEOWNERS`
- **Detailed steps:**
  1. Create a `CODEOWNERS` file in `.github/`.
  2. Map top-level paths (e.g., `/server/`, `/client/`, `/awsData/`, `/.github/workflows/`) to responsible owners.
- **Verification:** GitHub auto-requests reviews when a file in a mapped path is modified.

---

### Task R2: Write Comprehensive Project README

- **Goal:** Replace the current README stub with developer-friendly documentation.
- **Why it is required:** A good README is essential for onboarding and project visibility.
- **Files/Folders affected:** `README.md`
- **Detailed steps:**
  1. Rewrite `README.md` to include: Project Overview, Tech Stack, Developer Setup, Available Scripts, and links to detailed docs.
- **Verification:** `README.md` is readable and complete.

---

### Task R3: Create CONTRIBUTING Guide

- **Goal:** Write an onboarding guide explaining the contribution workflow.
- **Why it is required:** Ensures every engineer knows how to fork, branch, commit, and submit PRs according to CommerSync guidelines.
- **Files/Folders affected:** `CONTRIBUTING.md`
- **Detailed steps:**
  1. Create `CONTRIBUTING.md` in the root directory.
  2. Link it to the branch strategy, commit conventions, and PR template.
- **Verification:** Guide is present and complete.

---

### Task R4: Initialize Architecture Decision Records (ADRs)

- **Goal:** Create the ADR directory and establish the process for documenting design decisions.
- **Why it is required:** Architectural decisions must be documented with context and alternatives to preserve engineering memory.
- **Files/Folders affected:** `docs/adr/`
- **Detailed steps:**
  1. Create the `docs/adr/` directory.
  2. Write `ADR-000-template.md` containing the standard decision template.
  3. Write `ADR-001-repository-conventions.md` to document the decisions made in Phase 1 (monorepo structure, branch strategy, squash merge).
- **Verification:** Directory and initial files exist.

---

## Suggested Implementation Sequence

```
Step 1: Clean Up & Security (C1, C2)
├── Remove tracked .DS_Store files
└── Reference GitHub Secrets for AWS Account ID

Step 2: Branching & Controls (C3, C4)
├── Establish main branch & trunk-based documentation
└── Configure GitHub branch protection rulesets

Step 3: Contribution Workflow & Guidelines (C5, C6, R1)
├── Document Conventional Commits
├── Create PR Template
└── Add CODEOWNERS rules

Step 4: Documentation & Process (R2, R3, R4)
├── Rewrite README & CONTRIBUTING guides
└── Initialize ADR directory and write ADR-001
```
