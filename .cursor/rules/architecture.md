# Architecture

## Overview

This framework follows **Page Object Model (POM)** with **BDD (Cucumber)** and a strict **separation of concerns**. Each layer has a single responsibility and communicates only with adjacent layers.

## Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│  features/*.feature          (Gherkin — living docs)    │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  stepdefinitions/*.steps.ts  (Cucumber glue — no PW)    │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  pages/*.ts                  (Business actions)         │
└───────────┬───────────────────────────────┬─────────────┘
            │                               │
┌───────────▼──────────┐       ┌────────────▼────────────┐
│  locators/*.ts        │       │  base/BaseActions       │
│  (Selectors only)     │       │  base/BaseAssertions    │
└──────────────────────┘       └────────────┬────────────┘
                                            │
                               ┌────────────▼────────────┐
                               │  Playwright API          │
                               └─────────────────────────┘
```

## Cross-Cutting Concerns

| Concern           | Location                       | Purpose                             |
| ----------------- | ------------------------------ | ----------------------------------- |
| Browser lifecycle | `hooks/` + `browserManager.ts` | Launch, context isolation, teardown |
| Configuration     | `config/`                      | Environment, browser, timeouts      |
| Logging           | `utils/logger.ts`              | Structured action logging           |
| Reporting         | `utils/allureHelper.ts`        | Allure artifacts on failure         |
| Test data         | `testdata/`                    | JSON inputs, no hardcoded secrets   |

## Design Principles

1. **Single Responsibility** — locators hold selectors; pages hold actions; steps hold mappings.
2. **Open/Closed** — extend via new page/locator files without modifying base classes.
3. **Dependency Inversion** — step definitions depend on page abstractions, not Playwright.
4. **DRY** — all browser interactions flow through `BaseActions` / `BaseAssertions`.

## Browser Lifecycle (Performance)

- **One browser per Cucumber worker** — shared via `BrowserManager`.
- **One context per scenario** — ensures test isolation in parallel runs.
- **One page per scenario** — fresh state without full browser restart.

## Reference Module

The Login module (`LoginLocators`, `LoginPage`, `login.feature`, `login.steps.ts`, `login.json`) is the canonical template for all future modules.
