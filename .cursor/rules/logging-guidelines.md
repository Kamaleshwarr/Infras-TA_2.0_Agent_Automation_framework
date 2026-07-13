# Logging Guidelines

## Logger Utility

Location: `src/utils/logger.ts` — **Winston**-based enterprise logger.

Every framework layer uses `createLogger(context)` for structured output.

## Log Format

```
[2026-07-13T12:00:00.000+00:00] [INFO] [LoginPage] Clicking Login button
```

Components: timestamp, level, context, message.

## Log Levels

| Level   | Usage                                                  |
| ------- | ------------------------------------------------------ |
| `DEBUG` | Verbose internals (config values, selector resolution) |
| `INFO`  | Normal operations (default)                            |
| `WARN`  | Recoverable issues                                     |
| `ERROR` | Failures, exceptions                                   |

Set via environment: `LOG_LEVEL=DEBUG`

## What to Log

- Browser launch and teardown
- Navigation URLs
- User actions (click, fill, select)
- Verification steps
- Scenario start/end in hooks

## What Not to Log

- Passwords or secrets (mask sensitive data)
- Full page HTML dumps
- Excessive debug in production CI runs

## Integration

- `BaseActions` logs every interaction automatically.
- `BaseAssertions` logs every verification.
- Page classes log business-level operations.
- Hooks log lifecycle events.

## Anti-Patterns

- `console.log()` scattered in page/step files (ESLint `no-console` enforced).
- Logging without context (always include class name).
- Logging credentials or PII.
