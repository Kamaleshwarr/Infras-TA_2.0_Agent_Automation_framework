# Configuration

All configuration is externalized — no code changes needed to switch environments or execution modes.

## Environment File

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENV` | `QA` | Target environment: `DEV`, `QA`, `UAT`, `PROD` |
| `BROWSER` | `chromium` | Browser engine: `chromium`, `firefox`, `webkit` |
| `HEADLESS` | `true` | Headless execution (default) |
| `BASE_URL` | Per ENV | Override application URL |
| `TAGS` | — | Cucumber tag filter |
| `TIMEOUT` | `60000` | Scenario timeout (ms) |
| `ACTION_TIMEOUT` | `15000` | Element action timeout (ms) |
| `NAVIGATION_TIMEOUT` | `30000` | Page navigation timeout (ms) |
| `WORKERS` | `1` | Parallel worker count |
| `RETRIES` | `0` | Retry count on failure |
| `SLOW_MO` | `0` | Slow motion delay for debugging (ms) |
| `ENABLE_TRACING` | `true` | Playwright trace on failure |
| `RECORD_VIDEO` | `true` | Video recording per scenario |
| `LOG_LEVEL` | `INFO` | Log verbosity: `DEBUG`, `INFO`, `WARN`, `ERROR` |

## Environment URLs

Defined in `src/constants/index.ts`:

| Environment | Default URL |
|-------------|-------------|
| DEV | `https://www.saucedemo.com` |
| QA | `https://www.saucedemo.com` |
| UAT | `https://www.saucedemo.com` |
| PROD | `https://www.saucedemo.com` |

Override any environment with `BASE_URL`:

```bash
BASE_URL=https://staging.example.com npm test
```

## CI/CD Example

```yaml
env:
  ENV: QA
  HEADLESS: true
  WORKERS: 4
  ENABLE_TRACING: false
  RECORD_VIDEO: false
run: npm test
```

## Configuration Source

Runtime config is resolved by `src/config/environment.config.ts` — the single source of truth.
