# Base Class Guidelines

## Classes

| Class            | Responsibility                                               |
| ---------------- | ------------------------------------------------------------ |
| `BaseActions`    | Reusable Playwright interactions (click, fill, wait, scroll) |
| `BaseAssertions` | Reusable verifications (text, URL, visibility, count)        |
| `BasePage`       | Composes actions + assertions + logger for page objects      |

## BaseActions

- Every method logs before executing.
- Every method uses explicit waits (`waitFor`, action timeouts).
- Accept `Locator` + human-readable `elementName` for logging.
- Never contain page-specific or application-specific logic.

## BaseAssertions

- Uses `@playwright/test` `expect` API internally.
- Respects `actionTimeout` from environment config.
- Never contain page-specific selectors.

## BasePage

- Abstract base — page objects extend it.
- Provides `this.actions`, `this.assertions`, `this.logger`.
- Logger context is the page class name.

## Extension

Add new generic actions/assertions to base classes when **three or more** page objects need the same behavior. Do not add one-off helpers.

## Anti-Patterns

- Page-specific methods in base classes.
- Assertions directly in `BaseActions`.
- Bypassing base classes for "quick" tests in step definitions.
