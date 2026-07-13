# Source Code (`src/`)

## Purpose

Root of all framework source code. Each subfolder has a dedicated responsibility and its own README.

## Structure

```
src/
├── base/             # BaseActions, BaseAssertions, BasePage
├── config/           # Environment, BrowserFactory, Playwright config
├── constants/        # Split constant files
├── core/             # DependencyRegistry
├── enums/            # Typed enums
├── exceptions/       # Exception hierarchy
├── interfaces/       # Interface contracts
├── locators/         # Selectors only
├── pages/            # Business actions (POM)
├── stepdefinitions/  # Cucumber step glue
├── hooks/            # Browser lifecycle & artifacts
├── features/         # Gherkin scenarios
├── utils/            # common/, json/, report/, string/
├── testdata/         # JSON + TestDataProvider
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

## Architecture Status

**Frozen at v1.2.0** — see [docs/framework-freeze.md](../../docs/framework-freeze.md).

## Related

- [docs/folder-structure.md](../../docs/folder-structure.md)
- [.cursor/rules/architecture.md](../../.cursor/rules/architecture.md)
