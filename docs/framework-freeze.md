# Framework Architecture Freeze

**Version:** 1.2.0  
**Status:** FROZEN  
**Date:** 2026-07-13

## Policy

As of v1.2.0, the **framework architecture is frozen**. The foundation is considered production-ready and stable for long-term enterprise use.

## Allowed Changes

- Bug fixes in framework core
- Reusable enhancements (new base actions, new utility helpers)
- Critical security or performance improvements
- Documentation updates to stay synchronized with code
- **New application modules** (Dashboard, Customer, Policy, Quote, etc.)

## Restricted Changes

- Redesigning folder structure
- Replacing core technologies (Playwright, Cucumber, Allure)
- Breaking changes to base classes, hooks, or dependency registry
- Removing established patterns (POM, separated locators, step delegation)

## Module Development

All new functionality must be implemented as **application modules** following:

1. [`.cursor/prompts/create-new-module.md`](../.cursor/prompts/create-new-module.md)
2. Existing Login module as reference
3. Documentation-first development rule

## Health Check

Before starting work, run:

```bash
npm run doctor
```

## Versioning

Framework versions follow [Semantic Versioning](../CHANGELOG.md):

- **Patch** (1.2.x): Bug fixes
- **Minor** (1.x.0): Reusable enhancements, new modules
- **Major** (x.0.0): Breaking architecture changes (requires ADR and team approval)
