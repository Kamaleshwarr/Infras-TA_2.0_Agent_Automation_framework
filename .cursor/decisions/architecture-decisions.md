# Architecture Decision Records (ADR)

## ADR-001: Page Object Model with Separated Locators

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Need a maintainable structure for multiple automation engineers working on the same codebase.

### Decision

Separate locator files from page classes. Locators contain selectors only; pages contain business actions.

### Consequences

- UI changes require updates in one locator file only.
- Slightly more files per module, but clearer responsibilities.

---

## ADR-002: Cucumber BDD over Playwright Test Runner

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Stakeholders need readable living documentation. Engineers need type-safe page objects.

### Decision

Use Cucumber for BDD scenarios with Playwright as the browser driver (not `@playwright/test` runner).

### Consequences

- Gherkin features serve as living docs.
- `@playwright/test` used only for `expect` assertions.
- Hooks manage browser lifecycle manually.

---

## ADR-003: Shared Browser per Worker

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Launching a browser per scenario is slow, especially in CI with parallel workers.

### Decision

`BrowserManager` launches one browser per Cucumber worker process. Each scenario gets an isolated `BrowserContext`.

### Consequences

- Faster execution in parallel CI runs.
- Scenarios remain isolated via separate contexts.
- Browser closed in `AfterAll`.

---

## ADR-004: Allure for Reporting

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Need rich HTML reports with failure artifacts for enterprise QA workflows.

### Decision

Use Allure Report with `allure-cucumberjs` reporter. Attach screenshot, video, and trace on failure.

### Consequences

- Requires `allure generate` step for HTML report.
- Artifacts configurable via `ENABLE_TRACING` and `RECORD_VIDEO`.

---

## ADR-005: Documentation-First Development

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Enterprise projects require maintainable knowledge transfer across engineers and AI agents.

### Decision

Documentation is mandatory and equal to code. `.cursor/` directory serves as AI knowledge base. Every folder has a README.

### Consequences

- Higher upfront effort per feature.
- Reduced onboarding time and fewer standard violations.

---

## ADR-007: Winston Logging

**Status:** Accepted  
**Date:** 2026-07-13

### Decision

Replace console.log with Winston for structured, level-based logging.

### Consequences

- ESLint `no-console` enforced project-wide.
- Consistent timestamps and log levels across all components.

---

## ADR-008: BrowserFactory Pattern

**Status:** Accepted  
**Date:** 2026-07-13

### Decision

Extract browser resolution into `BrowserFactory` supporting chromium, chrome, firefox, edge, webkit via `BROWSER` env var.

### Consequences

- Browser switching requires zero code changes.
- `BrowserManager` focuses on lifecycle only.

---

## ADR-009: TestDataProvider Abstraction

**Status:** Accepted  
**Date:** 2026-07-13

### Decision

Introduce `ITestDataProvider` interface with `TestDataProvider` facade. JSON implemented; CSV/Excel/DB/API reserved.

### Consequences

- Single entry point for all test data.
- Future data sources added without changing step definitions.
