# Troubleshooting

## Browser Issues

### Browsers not installed

```bash
npx playwright install chromium
# or
npm install  # triggers postinstall
```

### Missing system dependencies (Linux)

```bash
sudo npx playwright install-deps chromium
```

### Browser crashes in CI

- Ensure sufficient memory for parallel workers.
- Reduce `WORKERS` if OOM occurs.
- Use `HEADLESS=true` (default).

## Test Failures

### Timeout errors

- Increase `ACTION_TIMEOUT` or `NAVIGATION_TIMEOUT` in `.env`.
- Check network connectivity to target environment.
- Verify selectors in locator files haven't changed.

### Element not found

- Confirm locator in `{Page}Locators.ts`.
- Check if page finished loading — use `waitForPageLoad()`.
- Run headed to visually debug: `npm run test:headed`.

### Flaky tests

- Remove any `waitForTimeout()` usage.
- Use locator-based waits only.
- Ensure scenarios are isolated (no shared state).

## Parallel Execution

### Tests fail only in parallel

- Verify scenarios don't depend on execution order.
- Ensure unique test data per scenario.
- Each scenario must have its own context (default behavior).

### Worker crashes

- Lower `WORKERS` count.
- Disable video/tracing: `ENABLE_TRACING=false RECORD_VIDEO=false`.

## Allure Report

### Empty report

- Confirm tests ran: check `src/reports/allure-results/` has JSON files.
- Regenerate: `npm run allure:generate`.

### Missing attachments

- Verify scenario failed (artifacts attach on failure only).
- Check `RECORD_VIDEO` and `ENABLE_TRACING` are `true`.

## TypeScript

### Compilation errors

```bash
npm run lint
```

- Ensure strict types — no implicit `any`.
- Match import paths to `tsconfig.json` `rootDir`.

## Environment

### Wrong environment URL

- Check `ENV` and `BASE_URL` in `.env`.
- Valid values: `DEV`, `QA`, `UAT`, `PROD`.

### Headed mode not working

```bash
npm run test:headed
# or
HEADLESS=false npm test
```

## Getting Help

1. Check logs — every action is logged with context.
2. Review Playwright trace (on failure): open ZIP in [trace.playwright.dev](https://trace.playwright.dev).
3. Consult `docs/faq.md` and module README files.
