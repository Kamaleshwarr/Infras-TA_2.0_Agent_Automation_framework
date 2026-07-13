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

## ADR-006: Multi-Environment Configuration

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Enterprise QA requires running the same suite against DEV, QA, UAT, and PROD targets without code changes.

### Decision

Use environment-specific files (`.env.dev`, `.env.qa`, `.env.uat`, `.env.prod`) plus an optional local `.env` override. Runtime process environment variables take highest priority over file-based values.

### Consequences

- `ENV` and `BASE_URL` switch targets via npm scripts (`test:env:qa`, etc.).
- CI and cross-browser runners can override `BROWSER` without `.env` clobbering runtime values.
- `.env.example` documents all supported variables.

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

---

## ADR-010: Why Playwright

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Need a modern, cross-browser automation engine with reliable auto-waiting and strong debugging tools.

### Decision

Adopt Playwright as the browser automation engine.

### Rationale

- Cross-browser support (Chromium, Firefox, WebKit) from a single API
- Built-in auto-waiting reduces flaky tests
- Trace viewer, video, and screenshot for debugging
- Active development and strong TypeScript support
- Better suited for enterprise CI/CD than legacy tools

### Consequences

- Hooks manage browser lifecycle manually (not using Playwright Test runner)
- `@playwright/test` used only for `expect` assertions

---

## ADR-011: Why TypeScript

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Multiple engineers contributing to the same codebase need type safety and IDE support.

### Decision

Use strict TypeScript for all framework code.

### Rationale

- Compile-time error detection
- Interface-driven design with strong contracts
- Superior refactoring support in IDEs
- Self-documenting types for page objects and config

### Consequences

- Strict compiler options enforced
- Build step via `tsc --noEmit` in CI

---

## ADR-012: Why Cucumber (BDD)

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Business stakeholders and QA need readable, living documentation of test scenarios.

### Decision

Use Cucumber with Gherkin feature files as the test specification layer.

### Rationale

- Human-readable scenarios bridge business and engineering
- Tag-based execution (@smoke, @regression) for flexible CI pipelines
- Feature files serve as living documentation
- Industry-standard BDD approach for enterprise QA

### Consequences

- Step definitions must stay thin (no Playwright code)
- Slightly more files per module than pure code-based tests

---

## ADR-013: Why Page Object Model

**Status:** Accepted  
**Date:** 2026-07-13

### Context

UI tests become unmaintainable when selectors and actions are scattered across step files.

### Decision

Implement strict Page Object Model with base classes.

### Rationale

- Encapsulates page behavior behind business methods
- Reduces duplication via BaseActions/BaseAssertions
- UI changes localized to page and locator files
- Industry-proven pattern for large automation suites

### Consequences

- One page class per application page
- All interactions flow through page methods

---

## ADR-014: Why Separate Locator Classes

**Status:** Accepted  
**Date:** 2026-07-13

### Context

When selectors live inside page classes, UI changes require editing business logic files.

### Decision

Extract all selectors into dedicated `{Page}Locators.ts` files.

### Rationale

- Single Responsibility: locators change when UI changes, not when business rules change
- Easier code review — selector changes are isolated diffs
- Prevents page classes from becoming bloated

### Consequences

- One additional file per page
- Page classes import locators, never define selectors inline

---

## ADR-015: Why Allure Report

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Enterprise QA requires rich HTML reports with failure artifacts and execution metadata.

### Decision

Use Allure Report with `allure-cucumberjs` integration.

### Rationale

- Industry-standard reporting for test automation
- Supports screenshots, video, traces, tags, and environment metadata
- Integrates with CI/CD artifact upload
- Readable by both engineers and QA managers

### Consequences

- Requires `allure generate` step for HTML report
- `AllureReportManager` implements `IReportManager` interface

---

## ADR-016: Exception Hierarchy

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Generic `Error` messages make debugging and error handling inconsistent.

### Decision

Create typed exception classes extending `FrameworkException`.

### Consequences

- Each domain (browser, config, data, reports) has a specific exception
- Error codes enable programmatic handling in CI

---

## ADR-017: DependencyRegistry (Lightweight DI)

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Direct `new` instantiation scattered across hooks makes testing and substitution difficult.

### Decision

Introduce `DependencyRegistry` as a lightweight service locator — not a full DI container.

### Rationale

- Central access to BrowserFactory, ReportManager, Logger
- Enables mock substitution in tests without framework overhead
- Avoids complexity of InversifyJS or similar containers

### Consequences

- Hooks and core use `dependencies.get*()` pattern
- Page objects still instantiate normally (no over-engineering)

---

## ADR-018: Architecture Freeze at v1.2.0

**Status:** Accepted  
**Date:** 2026-07-13

### Context

Continued framework redesign delays application module development.

### Decision

Freeze architecture at v1.2.0. Future work focuses on application modules.

### Consequences

- Framework changes limited to bug fixes and reusable enhancements
- All new functionality implemented as modules following Login reference pattern
- See [docs/framework-freeze.md](../../docs/framework-freeze.md)
