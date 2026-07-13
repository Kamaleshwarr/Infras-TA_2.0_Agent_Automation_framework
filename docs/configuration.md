# Configuration

All configuration is externalized — no code changes needed to switch environments, browsers, or execution modes.

## Environment Files

The framework loads configuration in this order (later overrides earlier):

1. `.env.{env}` — e.g. `.env.qa` when `ENV=QA`
2. `.env` — local overrides
3. Process environment variables — highest priority

| File           | Purpose                      |
| -------------- | ---------------------------- |
| `.env.dev`     | Development environment      |
| `.env.qa`      | QA environment (default)     |
| `.env.uat`     | UAT environment              |
| `.env.prod`    | Production smoke checks      |
| `.env.example` | Template for local `.env`    |
| `.env`         | Local overrides (gitignored) |

## Quick Setup

```bash
# Use QA defaults
ENV=QA npm test

# Use environment-specific file
npm run test:env:uat

# Local overrides
cp .env.example .env
```

## Variables

| Variable                | Default    | Description                                       |
| ----------------------- | ---------- | ------------------------------------------------- |
| `ENV`                   | `QA`       | Environment: `DEV`, `QA`, `UAT`, `PROD`           |
| `BROWSER`               | `chromium` | `chromium`, `chrome`, `firefox`, `edge`, `webkit` |
| `HEADLESS`              | `true`     | Headless execution                                |
| `BASE_URL`              | Per ENV    | Override application URL                          |
| `TAGS`                  | —          | Cucumber tag filter                               |
| `TIMEOUT`               | `60000`    | Scenario timeout (ms)                             |
| `ACTION_TIMEOUT`        | `15000`    | Element action timeout (ms)                       |
| `NAVIGATION_TIMEOUT`    | `30000`    | Navigation timeout (ms)                           |
| `WORKERS`               | `1`        | Parallel worker count                             |
| `RETRIES`               | `1`        | Retry count for transient failures                |
| `SLOW_MO`               | `0`        | Debug slow motion (ms)                            |
| `ENABLE_TRACING`        | `false`    | Playwright trace (retain-on-failure)              |
| `RECORD_VIDEO`          | `false`    | Video recording (retain-on-failure)               |
| `SCREENSHOT_ON_FAILURE` | `true`     | Screenshot on failure                             |
| `LOG_LEVEL`             | `INFO`     | `DEBUG`, `INFO`, `WARN`, `ERROR`                  |

## Browser Selection

Set `BROWSER` — no code changes required:

```bash
BROWSER=chrome npm test
BROWSER=edge npm run test:headed
BROWSER=firefox npm run test:cross-browser
```

## Artifact Strategy (Retain-on-Failure)

| Artifact   | Default | Behavior                               |
| ---------- | ------- | -------------------------------------- |
| Screenshot | On      | Captured and attached only on failure  |
| Video      | Off     | Recorded when enabled; deleted on pass |
| Trace      | Off     | Saved and attached only on failure     |

Enable for debugging or UAT:

```bash
ENABLE_TRACING=true RECORD_VIDEO=true npm run test:headed
```

## CI/CD Example

```yaml
env:
  ENV: QA
  HEADLESS: true
  WORKERS: 2
  RETRIES: 1
  ENABLE_TRACING: true
  RECORD_VIDEO: true
run: npm test
```

## Configuration Source

- `src/config/envLoader.ts` — file loading
- `src/config/environment.config.ts` — runtime resolution
- `src/config/browserFactory.ts` — browser selection
- `src/config/playwright.config.ts` — Playwright options
