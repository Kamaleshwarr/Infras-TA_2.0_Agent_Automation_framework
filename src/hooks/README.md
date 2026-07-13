# Hooks

## Purpose

Cucumber lifecycle hooks for browser management, logging, and failure artifact capture.

## Contents

| File | Responsibility |
|------|----------------|
| `world.ts` | `CustomWorld` — page objects and scenario state |
| `hooks.ts` | Before/After hooks — context, artifacts, teardown |
| `browserManager.ts` | Shared browser instance per Cucumber worker |

## Lifecycle

```
BeforeAll  → Initialize reports, environment properties
Before     → Create context + page (per scenario)
After      → Capture artifacts on failure, close context
AfterAll   → Close shared browser
```

## Performance Design

- **One browser per worker** — avoids repeated browser launches.
- **One context per scenario** — ensures isolation in parallel runs.

## Coding Standards

- No business logic in hooks.
- Artifact capture on failure only (screenshot always; video/trace when enabled).
- Register new page objects in `world.ts`.

## Related

- [Reporting Guidelines](../../.cursor/rules/reporting-guidelines.md)
- [docs/running-tests.md](../../docs/running-tests.md)
