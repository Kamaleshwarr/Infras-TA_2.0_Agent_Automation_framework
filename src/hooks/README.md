# Hooks

Cucumber lifecycle hooks for browser management, logging, and failure artifact capture.

## Contents

| File                | Responsibility                                    |
| ------------------- | ------------------------------------------------- |
| `world.ts`          | `CustomWorld` — page objects and scenario state   |
| `hooks.ts`          | Before/After hooks — context, artifacts, teardown |
| `browserManager.ts` | Shared browser per worker via `BrowserFactory`    |

## Lifecycle

```
BeforeAll  → Reports + environment.properties
Before     → Context + page (per scenario)
After      → Artifacts on failure, cleanup on pass
AfterAll   → Close shared browser
```

## Browser Management

- `BrowserManager` reuses one browser per Cucumber worker.
- `BrowserFactory` resolves browser type from `BROWSER` env var.
- Supported: `chromium`, `chrome`, `firefox`, `edge`, `webkit`.

## Artifact Strategy

| Artifact   | When                                        |
| ---------- | ------------------------------------------- |
| Screenshot | Failure only (`SCREENSHOT_ON_FAILURE=true`) |
| Video      | Retain-on-failure (`RECORD_VIDEO=true`)     |
| Trace      | Retain-on-failure (`ENABLE_TRACING=true`)   |

Passing scenarios delete video files to save disk space.

## Retry

Browser launch uses `RetryHelper` when `RETRIES > 0` for transient failures.

## Related

- [BrowserFactory](../config/browserFactory.ts)
- [docs/architecture.md](../../docs/architecture.md)
