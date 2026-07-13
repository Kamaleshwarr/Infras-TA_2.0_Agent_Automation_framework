# Playwright BDD Automation Framework

Enterprise-grade UI automation framework built with **Playwright**, **TypeScript**, **Cucumber (BDD)**, and **Allure Report**.

## Architecture Overview

```
src/
├── base/           # Reusable action & assertion layers (SOLID foundation)
├── config/         # Environment & browser configuration
├── constants/      # Shared enums, routes, timeouts
├── locators/       # Page locators only (no logic)
├── pages/          # Business actions only (Page Object Model)
├── stepdefinitions/# Cucumber step mappings (no Playwright code)
├── hooks/          # Browser lifecycle & failure artifacts
├── features/       # Gherkin feature files
├── utils/          # Logger, test data loader, Allure helpers
├── testdata/       # JSON test data (no hardcoded credentials)
├── reports/        # Allure results, screenshots, traces, videos
└── resources/      # Static test resources (uploads, fixtures)
```

## Quick Start

```bash
# Install dependencies & browsers
npm install

# Copy environment config
cp .env.example .env

# Run all tests
npm test

# Run with visible browser
npm run test:headed

# Run by tag
npm run test:tags "@smoke"

# Generate Allure report
npm run allure:generate
npm run allure:open
```

## Environment Configuration

Set `ENV` to `DEV`, `QA`, `UAT`, or `PROD`. Override URLs via `BASE_URL` without code changes.

| Variable | Default | Description |
|----------|---------|-------------|
| `ENV` | `QA` | Target environment |
| `BROWSER` | `chromium` | Browser engine |
| `HEADLESS` | `true` | Headless mode |
| `TAGS` | — | Cucumber tag filter |

## Reference Module

The **Login** module demonstrates the full pattern:

- `LoginLocators.ts` — selectors only
- `LoginPage.ts` — business actions & verifications via base classes
- `login.feature` — BDD scenarios
- `login.steps.ts` — step mappings delegating to `LoginPage`
- `login.json` — externalized credentials

## Design Principles

- **Strict TypeScript** with async/await only
- **No hardcoded waits** — explicit waits via Playwright APIs
- **Separation of concerns** — locators, pages, steps, and hooks are isolated
- **Failure artifacts** — screenshot, video, and trace attached to Allure on failure

## Demo Application

Login scenarios target [Sauce Demo](https://www.saucedemo.com) as the reference application.
