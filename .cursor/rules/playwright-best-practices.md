# Playwright Best Practices

## Wait Strategy

### Allowed

- `locator.waitFor({ state: 'visible' })`
- `expect(locator).toBeVisible()`
- `page.waitForLoadState('load' | 'domcontentloaded' | 'networkidle')`
- `page.waitForURL()`
- `page.waitForResponse()`

### Forbidden

- `page.waitForTimeout()` / `setTimeout()` for synchronization
- Hardcoded `sleep()` utilities

## Locator Priority

1. `data-test` / `data-testid` attributes
2. Role-based: `getByRole()`
3. Label-based: `getByLabel()`
4. Text-based: `getByText()` (when stable)
5. CSS / ID (last resort)

## Actions

- All interactions go through `BaseActions`.
- Always log the action with a human-readable element name.
- Wait for visibility before interacting.

## Browser Management

- Browser is shared per worker via `BrowserManager`.
- Each scenario gets an isolated `BrowserContext`.
- Never share pages or contexts across scenarios.

## Performance

- Avoid unnecessary `page.goto()` — reuse session when testing flows.
- Disable tracing/video in CI when not needed: `ENABLE_TRACING=false`, `RECORD_VIDEO=false`.
- Use parallel workers: `WORKERS=4 npm test`.

## Headless / Headed

- Default: headless (`HEADLESS=true`).
- Debug: `npm run test:headed` — no code changes required.

## Assertions

- Use `BaseAssertions` — never scatter raw `expect()` in page classes beyond base layer.
- Prefer locator-based assertions over DOM queries.

## Screenshots & Artifacts

- Captured automatically on failure in hooks.
- Manual screenshots via `BaseActions.takeScreenshot()`.
