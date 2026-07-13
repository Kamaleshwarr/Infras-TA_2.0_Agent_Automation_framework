# Source Code (`src/`)

## Purpose

Root of all framework source code. Each subfolder has a dedicated responsibility and its own README.

## Structure

```
src/
├── base/             # Reusable actions & assertions
├── config/           # Environment & Playwright config
├── constants/        # Shared enums, routes, timeouts
├── locators/         # Selectors only
├── pages/            # Business actions (POM)
├── stepdefinitions/  # Cucumber step glue
├── hooks/            # Browser lifecycle & artifacts
├── features/         # Gherkin scenarios
├── utils/            # Logger, test data, Allure
├── testdata/         # JSON test data (+ providers/)
├── reports/          # Generated artifacts
├── resources/        # Static test files
├── api/              # Future API testing
├── database/         # Future DB utilities
├── performance/      # Future perf testing
├── visual/           # Future visual regression
└── accessibility/    # Future a11y testing
```

## Documentation Rule

Every folder must have a `README.md`. When adding a new folder, create its README **before** adding code.

## Module Flow

```
features → stepdefinitions → pages → locators
                                ↓
                              base
                                ↓
                           Playwright
```

## Related

- [docs/folder-structure.md](../../docs/folder-structure.md)
- [.cursor/rules/architecture.md](../../.cursor/rules/architecture.md)
