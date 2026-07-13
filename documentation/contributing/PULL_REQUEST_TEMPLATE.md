# <!--

# CommerSync Pull Request Template

Thank you for contributing to CommerSync!

Please provide enough context for reviewers to understand WHAT changed, WHY it
changed, and HOW it was implemented.

Before submitting:

- Keep PRs small and focused.
- Follow Conventional Commits for the PR title.
- Ensure all CI checks pass.
- Complete all relevant sections below.
- Remove any sections that are not applicable only if explicitly permitted.

================================================================================
-->

# Pull Request

> **Title Format (Conventional Commits)**
>
> Examples:
>
> - `feat(auth): implement refresh token rotation`
> - `fix(cart): prevent duplicate item creation`
> - `refactor(cache): simplify Redis cache service`
> - `docs(api): update authentication guide`

---

# Description

<!--
Provide a concise summary of the change.

Include:
- What changed?
- Why was the change necessary?
- How was it implemented?
- Any important context reviewers should know?
-->

## Summary

---

## Implementation Overview

---

# Motivation

<!--
Explain the reason behind this change.

Link related issues when applicable.

Examples:

Fixes #123
Closes #456
Related #789
-->

## Business Motivation

-

## Technical Motivation

-

## Related Issues

- Fixes #
- Closes #
- Related #

---

# Changes Included

<!--
Select all that apply.
-->

- [ ] New Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Performance Improvement
- [ ] Documentation
- [ ] Test Improvements
- [ ] CI/CD
- [ ] Infrastructure
- [ ] Security
- [ ] Dependency Update
- [ ] Database Change
- [ ] API Change
- [ ] Configuration Change

---

# Technical Details

<!--
Provide implementation details that will help reviewers understand the solution.

Consider including:

- Architecture decisions
- Trade-offs
- Design patterns
- Database changes
- API changes
- Event changes
- Configuration updates
- Backward compatibility
-->

## Architecture Decisions

-

## Important Implementation Notes

-

## Trade-offs

-

## Database Changes

- [ ] Not Applicable

Description:

---

## API Changes

- [ ] Not Applicable

Description:

---

## Configuration Changes

- [ ] Not Applicable

Description:

---

# Testing

<!--
Describe how this change was validated.

Include evidence whenever possible.
-->

## Automated Testing

- [ ] Unit Tests
- [ ] Integration Tests
- [ ] End-to-End Tests
- [ ] Existing Tests Updated
- [ ] No Automated Tests Required

---

## Manual Testing

<!--
Describe the manual verification steps.
-->

---

## Edge Cases Tested

<!--
List important edge cases that were validated.
-->

---

## Test Evidence

<!--
Attach screenshots, logs, terminal output, API responses, or other supporting evidence if applicable.
-->

---

# Breaking Changes

<!--
Does this change introduce any breaking changes?

If yes, explain:

- What changed?
- Why is it breaking?
- Required migration steps.
-->

- [ ] No Breaking Changes
- [ ] Breaking Change

## Migration Instructions

---

# Deployment Notes

<!--
Describe any deployment considerations.

Examples:

- Environment variables
- Infrastructure updates
- Database migrations
- Cache invalidation
- Feature flags
-->

- [ ] No Special Deployment Steps

## Deployment Requirements

- [ ] Environment Variables
- [ ] Database Migration
- [ ] Infrastructure Changes
- [ ] Cache Invalidation
- [ ] Feature Flag Required
- [ ] Background Job / Worker Update
- [ ] API Gateway Changes
- [ ] Other

Details:

---

# Performance Impact

<!--
Describe any expected performance implications.

Include improvements, risks, or areas requiring monitoring.
-->

- [ ] No Performance Impact
- [ ] Performance Improved
- [ ] Performance Risk Identified

## Details

---

# Security Considerations

<!--
Review security implications carefully.
-->

- [ ] No Security Impact

## Checklist

- [ ] Authentication reviewed
- [ ] Authorization reviewed
- [ ] Input validation verified
- [ ] Sensitive data protected
- [ ] No secrets committed
- [ ] Dependencies reviewed
- [ ] Logging reviewed for sensitive information

## Additional Security Notes

---

# Reviewer Notes

<!--
Help reviewers focus on important areas.

Examples:

- Complex business logic
- Concurrency
- Performance-sensitive code
- Areas needing additional scrutiny
-->

## Please Pay Special Attention To

-

## Known Limitations

-

## Future Improvements

- ***

# Pre-Merge Checklist

<!--
Complete before requesting approval.
-->

## Code Quality

- [ ] Self-review completed
- [ ] Code follows project conventions
- [ ] No debug code remains
- [ ] No unnecessary commented code
- [ ] Naming reviewed
- [ ] Error handling reviewed
- [ ] Logging reviewed

---

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Regression testing completed
- [ ] Edge cases validated

---

## Documentation

- [ ] Documentation updated
- [ ] Comments added where appropriate
- [ ] API documentation updated (if applicable)
- [ ] Architecture documentation updated (if applicable)

---

## CI/CD

- [ ] Build passes
- [ ] Lint passes
- [ ] Type checking passes
- [ ] GitHub Actions pass
- [ ] Docker build verified (if applicable)

---

## Security

- [ ] No secrets committed
- [ ] Input validation verified
- [ ] Authentication reviewed
- [ ] Authorization reviewed
- [ ] Dependencies reviewed

---

## Deployment

- [ ] Safe to deploy
- [ ] Rollback strategy considered
- [ ] Database migration documented (if applicable)
- [ ] Feature flag configured (if applicable)
- [ ] Monitoring considerations documented

---

# Screenshots / Logs (Optional)

<!--
Include any relevant artifacts.

Examples:

- UI screenshots
- API responses
- Terminal output
- Test reports
- Performance metrics
- Architecture diagrams
-->

---

# Additional Notes

<!--
Anything else reviewers should know?
-->

---
