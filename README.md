# Playwright BDD Automation Framework

Enterprise-grade UI automation framework built with **Playwright**, **TypeScript**, **Cucumber (BDD)**, and **Allure Report**.

**Version:** 1.1.0 | [Changelog](CHANGELOG.md) | [License](LICENSE)

## Features

- Page Object Model with separated locators
- BDD scenarios with Cucumber
- Allure reporting with retain-on-failure artifacts
- Multi-environment support (`.env.dev`, `.env.qa`, `.env.uat`, `.env.prod`)
- Winston structured logging
- BrowserFactory (chromium, chrome, firefox, edge, webkit)
- Headless (default), headed, parallel, and cross-browser execution
- ESLint + Prettier + Husky quality gates
- GitHub Actions CI/CD
- TestDataProvider abstraction for JSON (extensible to CSV/Excel/DB/API)

## Quick Start

```bash
npm install
cp .env.example .env   # or rely on .env.qa via ENV=QA
npm test               # Headless, sequential
npm run report         # Allure HTML report
```

## Execution Modes

| Command                      | Description                 |
| ---------------------------- | --------------------------- |
| `npm test`                   | Headless (default)          |
| `npm run test:headed`        | Visible browser             |
| `npm run test:parallel`      | 4 parallel workers          |
| `npm run test:smoke`         | `@smoke` tag                |
| `npm run test:regression`    | `@regression` tag           |
| `npm run test:sanity`        | `@sanity` tag               |
| `npm run test:cross-browser` | chromium → firefox → webkit |
| `npm run test:retry`         | Suite-level retry           |
| `npm run test:env:qa`        | Load `.env.qa` config       |

See [docs/running-tests.md](docs/running-tests.md).

## Quality Gates

```bash
npm run lint           # ESLint + TypeScript + Prettier
npm run lint:fix       # Auto-fix lint and format
npm run format         # Prettier write
```

Pre-commit hooks (Husky + lint-staged) run ESLint and Prettier automatically.

## Documentation

| Resource                                     | Description                             |
| -------------------------------------------- | --------------------------------------- |
| [docs/](docs/README.md)                      | Installation, config, architecture, FAQ |
| [docs/architecture.md](docs/architecture.md) | Diagrams and lifecycles                 |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Contribution guidelines                 |
| [.cursor/](.cursor/README.md)                | AI knowledge base & standards           |
| [CHANGELOG.md](CHANGELOG.md)                 | Version history                         |

## Architecture

```
Feature → Step Definition → Page → Locator → Base Layer → Playwright → Browser
```

See [docs/architecture.md](docs/architecture.md) for full diagrams.

## Environment

```bash
ENV=QA                 # Loads .env.qa automatically
BROWSER=chromium       # chromium | chrome | firefox | edge | webkit
HEADLESS=true
WORKERS=4
RETRIES=1
```

Full reference: [docs/configuration.md](docs/configuration.md)

## Contributing

Documentation is mandatory with every change. Read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
