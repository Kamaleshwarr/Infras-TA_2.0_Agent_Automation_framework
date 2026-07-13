# Running Tests

## Default (Headless)

Headless is the **default** execution mode — no configuration required.

```bash
npm test
```

Equivalent to `HEADLESS=true`.

## Headed Mode

Opens a visible browser window. Useful for debugging.

```bash
npm run test:headed
```

Or via environment variable:

```bash
HEADLESS=false npm test
```

No code changes are ever required to switch modes.

## Tag Execution

Run scenarios matching specific tags:

```bash
# Smoke tests only
npm run test:smoke

# Custom tag expression
npm run test:tags "@login and @positive"

# Via environment variable
TAGS="@smoke" npm test
```

## Environment Selection

```bash
ENV=UAT npm test
ENV=DEV npm run test:headed
```

## Parallel Execution

Run scenarios across multiple workers for faster CI feedback:

```bash
# 4 workers (recommended for CI)
npm run test:parallel

# Custom worker count
WORKERS=8 npm test

# Parallel + headed (debugging)
npm run test:parallel:headed
```

Parallel behavior:

- One browser instance per worker (shared across scenarios in that worker).
- Each scenario gets an isolated browser context.
- Set `WORKERS=1` for sequential execution (default).

## Fast CI Execution

Disable optional artifacts for maximum speed:

```bash
ENABLE_TRACING=false RECORD_VIDEO=false WORKERS=4 npm test
```

Screenshots on failure remain enabled.

## Type Checking

```bash
npm run lint
```

## Command Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless, sequential) |
| `npm run test:headed` | Run with visible browser |
| `npm run test:parallel` | Run with 4 parallel workers |
| `npm run test:parallel:headed` | Parallel + headed |
| `npm run test:smoke` | Run `@smoke` tagged scenarios |
| `npm run test:tags` | Run custom tag expression |
| `npm run lint` | TypeScript type check |
