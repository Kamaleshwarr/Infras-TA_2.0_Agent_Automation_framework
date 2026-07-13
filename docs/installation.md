# Installation

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**

## Setup

```bash
# Clone the repository
git clone <repository-url>
cd playwright-automation-framework

# Install dependencies (includes Playwright browsers via postinstall)
npm install

# Create local environment file
cp .env.example .env
```

## Verify Installation

```bash
# TypeScript compilation
npm run lint

# Run the Login test suite
npm test
```

## Linux System Dependencies

If browsers fail to launch on Linux:

```bash
sudo npx playwright install-deps chromium
```

## IDE Setup

Recommended:

- **VS Code** or **Cursor** with extensions:
  - Cucumber (Gherkin) support
  - ESLint / TypeScript

## Next Steps

- [Configuration](configuration.md) — customize environment
- [Running Tests](running-tests.md) — execution modes
- [Allure Reporting](allure-reporting.md) — generate reports
