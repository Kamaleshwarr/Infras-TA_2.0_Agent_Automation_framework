# Playwright BDD Automation Framework

Enterprise-grade UI automation framework built with **Playwright**, **TypeScript**, **Cucumber (BDD)**, and **Allure Report**.

Designed for scalability, maintainability, and multi-engineer collaboration.

## Features

- Page Object Model with separated locators
- BDD scenarios with Cucumber
- Allure reporting with failure artifacts
- Multi-environment support (DEV / QA / UAT / PROD)
- Headless (default) and headed execution
- Parallel execution with configurable workers
- Structured logging for every action
- Documentation-first development standards

## Quick Start

```bash
npm install
cp .env.example .env
npm test
```

## Running Tests

| Command | Mode |
|---------|------|
| `npm test` | Headless (default), sequential |
| `npm run test:headed` | Visible browser |
| `npm run test:parallel` | Headless, 4 workers |
| `npm run test:smoke` | `@smoke` tagged scenarios |
| `npm run report` | Generate & open Allure report |

See [docs/running-tests.md](docs/running-tests.md) for full details.

## Documentation

| Resource | Description |
|----------|-------------|
| [docs/](docs/README.md) | Installation, config, running tests, FAQ |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [.cursor/rules/](.cursor/rules/architecture.md) | AI knowledge base & standards |
| [src/](src/) | Each folder has its own README |

## Architecture

```
src/
├── base/             # Reusable actions & assertions
├── config/           # Environment & browser config
├── locators/         # Selectors only
├── pages/            # Business actions (POM)
├── stepdefinitions/  # Cucumber glue (no Playwright)
├── hooks/            # Browser lifecycle & artifacts
├── features/         # Gherkin scenarios
├── utils/            # Logger, test data, Allure
├── testdata/         # JSON test data
└── reports/          # Generated artifacts
```

## Reference Module

The **Login** module demonstrates the complete pattern. See [src/pages/README.md](src/pages/README.md).

## Environment

Configure via `.env` — no code changes required:

```bash
ENV=QA
HEADLESS=true
WORKERS=4
BROWSER=chromium
```

Full reference: [docs/configuration.md](docs/configuration.md)

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Documentation is mandatory with every change.

## License

MIT
