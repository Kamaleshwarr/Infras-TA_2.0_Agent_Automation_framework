# Playwright BDD Automation Framework

Enterprise-grade UI automation framework built with **Playwright**, **TypeScript**, **Cucumber (BDD)**, and **Allure Report**.

**Version:** 1.3.0 (Architecture Frozen) | [Changelog](CHANGELOG.md) | [License](LICENSE)

> The framework architecture is **frozen at v1.2.0**. Future work focuses on application modules. See [docs/framework-freeze.md](docs/framework-freeze.md).

## Features

- Page Object Model with separated locators and interface-driven design
- BDD scenarios with Cucumber
- Allure reporting with rich execution metadata
- Winston structured logging with sensitive value masking
- BrowserFactory (chromium, chrome, firefox, edge, webkit)
- Multi-environment files (`.env.dev`, `.env.qa`, `.env.uat`, `.env.prod`)
- Exception hierarchy, enums, and centralized constants
- ESLint + Prettier + Husky quality gates
- GitHub Actions CI/CD
- `npm run doctor` health check

## Quick Start

```bash
npm install
npm run doctor          # Verify framework health
npm test                # Headless execution
npm run report          # Allure HTML report
```

## Execution Modes

| Command                      | Description                 |
| ---------------------------- | --------------------------- |
| `npm test`                   | Headless (default)          |
| `npm run test:headed`        | Visible browser             |
| `npm run test:parallel`      | 4 parallel workers          |
| `npm run test:smoke`         | `@smoke` tag                |
| `npm run test:regression`    | `@regression` tag           |
| `npm run test:cross-browser` | chromium → firefox → webkit |

See [docs/running-tests.md](docs/running-tests.md).

## Architecture

```
Feature → Step Definition → Page → Locator → Base Layer → Playwright → Browser
```

Layer details: [docs/architecture.md](docs/architecture.md)

## Project Structure

```
src/
├── base/          # BaseActions, BaseAssertions, BasePage
├── config/        # Environment, BrowserFactory, Playwright config
├── constants/     # Split constant files
├── core/          # DependencyRegistry
├── enums/         # BrowserType, Environment, TagType, etc.
├── exceptions/    # Typed exception hierarchy
├── interfaces/    # IBrowserFactory, ILogger, IReportManager, etc.
├── hooks/         # Browser lifecycle & artifacts
├── pages/         # Business actions (POM)
├── locators/      # Selectors only
├── features/      # Gherkin scenarios
├── stepdefinitions/
├── testdata/      # JSON + TestDataProvider
└── utils/         # common/, json/, report/, string/
```

## Quality Gates

```bash
npm run lint           # ESLint + TypeScript + Prettier
npm run doctor         # Framework health check
```

## Documentation

| Resource                                             | Description                |
| ---------------------------------------------------- | -------------------------- |
| [docs/](docs/README.md)                              | Full documentation index   |
| [docs/framework-freeze.md](docs/framework-freeze.md) | Architecture freeze policy |
| [.cursor/](.cursor/README.md)                        | AI knowledge base          |
| [CONTRIBUTING.md](CONTRIBUTING.md)                   | Contribution guidelines    |

## License

[MIT](LICENSE)
