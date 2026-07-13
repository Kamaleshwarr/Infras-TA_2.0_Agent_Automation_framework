# Frequently Asked Questions (FAQ)

## General

### What technologies does this framework use?

Playwright, TypeScript, Cucumber (BDD), Node.js, and Allure Report.

### What application does this framework automate?

The [Transamerica Agent Portal](https://secure.transamerica.com) — Login, Dashboard, and Application Wizard business flows.

### What demo application is used?

None. This framework automates the real Transamerica Agent Portal only. Authenticated scenarios require `AGENT_USERNAME` and `AGENT_PASSWORD` environment variables.

### Can I run authenticated scenarios in CI?

Yes. Configure `AGENT_USERNAME` and `AGENT_PASSWORD` as protected environment variables. Scenarios tagged `@requires-credentials` are skipped automatically when credentials are not available.

## Execution

### Is headless the default?

Yes. `npm test` runs headless. Use `npm run test:headed` for visible browser.

### How do I run tests in parallel?

```bash
npm run test:parallel
# or
WORKERS=4 npm test
```

### How do I run only smoke tests?

```bash
npm run test:smoke
```

### Do I need to change code to switch headless/headed?

No. Use npm scripts or the `HEADLESS` environment variable.

## Architecture

### Why are locators separate from pages?

So UI selector changes are isolated to one file. Pages contain business logic only.

### Can I use Playwright in step definitions?

No. Steps must delegate to page objects. This keeps Gherkin reusable and maintainable.

### How do I add a new module?

Follow [`.cursor/prompts/create-new-module.md`](../.cursor/prompts/create-new-module.md).

## Reporting

### How do I view test results?

```bash
npm run report
```

### Why are there no videos/traces for passing tests?

Artifacts are captured on failure only to optimize storage and execution speed.

### How do I verify the framework is healthy?

```bash
npm run doctor
```

### Can I disable video/tracing for faster CI?

Yes:

```bash
ENABLE_TRACING=false RECORD_VIDEO=false npm test
```

## Configuration

### How do I switch environments?

Set `ENV=DEV|QA|UAT|PROD` in `.env` or as an environment variable.

### Where are credentials stored?

In `src/testdata/*.json` files — never in source code.

## Contributing

### What must I include in a PR?

Code, tests, and updated documentation. See [CONTRIBUTING.md](../CONTRIBUTING.md).

### Where are coding standards documented?

In [`.cursor/rules/`](../.cursor/rules/) and [docs/coding-standards.md](coding-standards.md).
