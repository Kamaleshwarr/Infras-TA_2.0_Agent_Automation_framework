# Running Tests

## Default (Headless)

Headless is the **default** — no configuration required.

```bash
npm test
```

## Headed Mode

```bash
npm run test:headed
# or
HEADLESS=false npm test
```

## Parallel Execution

```bash
npm run test:parallel          # 4 workers
WORKERS=8 npm test             # Custom worker count
npm run test:parallel:headed   # Parallel + visible browser
```

## Tag Execution

| Script                    | Tag           |
| ------------------------- | ------------- |
| `npm run test:smoke`      | `@smoke`      |
| `npm run test:regression` | `@regression` |
| `npm run test:sanity`     | `@sanity`     |
| `npm run test:critical`   | `@critical`   |
| `npm run test:ui`         | `@ui`         |
| `npm run test:wip`        | `@wip`        |

Custom expressions:

```bash
npm run test:tags "@smoke and @login"
TAGS="@regression and not @wip" npm test
```

## Environment Selection

| Script                  | Loads       |
| ----------------------- | ----------- |
| `npm run test:env:dev`  | `.env.dev`  |
| `npm run test:env:qa`   | `.env.qa`   |
| `npm run test:env:uat`  | `.env.uat`  |
| `npm run test:env:prod` | `.env.prod` |

## Cross-Browser

Runs the full suite on chromium, firefox, and webkit sequentially:

```bash
npm run test:cross-browser
```

Single browser via environment:

```bash
BROWSER=firefox npm test
BROWSER=chrome npm run test:headed
BROWSER=edge npm test
```

## Retry Strategy

### Transient failures (browser launch, network)

Set `RETRIES=1` in environment config. Applied via `RetryHelper` during browser launch.

### Suite-level retry

Re-runs the entire suite up to `RETRIES+1` times:

```bash
RETRIES=2 npm run test:retry
```

## Fast CI Execution

```bash
ENABLE_TRACING=false RECORD_VIDEO=false WORKERS=4 npm test
```

## Quality Checks

```bash
npm run lint           # ESLint + TypeScript + Prettier
npm run lint:fix       # Auto-fix
npm run format:check   # Prettier check only
```

## Reporting

```bash
npm run allure:generate
npm run allure:open
npm run report         # Generate + open
```

## Command Reference

| Command                      | Mode                 |
| ---------------------------- | -------------------- |
| `npm test`                   | Headless, sequential |
| `npm run test:headed`        | Headed               |
| `npm run test:parallel`      | Headless, 4 workers  |
| `npm run test:smoke`         | Smoke tag            |
| `npm run test:regression`    | Regression tag       |
| `npm run test:sanity`        | Sanity tag           |
| `npm run test:cross-browser` | All browsers         |
| `npm run test:retry`         | Suite retry          |

No code modifications are required for any execution mode.
