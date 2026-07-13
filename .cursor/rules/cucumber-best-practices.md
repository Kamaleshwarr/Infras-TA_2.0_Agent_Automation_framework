# Cucumber Best Practices

## Feature Files

- One feature per application module or capability.
- Use `@tags` for filtering: `@smoke`, `@regression`, `@login`.
- Keep scenarios independent — no execution order dependencies.
- Use `Background` for shared preconditions within a feature.
- Use `Scenario Outline` + `Examples` for data-driven tests.

## Step Definitions

- **Never** import or use Playwright directly in step files.
- Delegate all interactions to page objects via `CustomWorld`.
- Keep steps thin — one logical action or verification per step.
- Reuse steps across features; avoid duplicate step text.

## World Object

- Access page objects via `this.{page}Page` on `CustomWorld`.
- Register new page objects in `world.ts` → `initializePages()`.

## Tags

| Tag           | Purpose                          |
| ------------- | -------------------------------- |
| `@smoke`      | Critical path, fast feedback     |
| `@regression` | Full coverage                    |
| `@negative`   | Error/validation paths           |
| `@wip`        | Work in progress (exclude in CI) |

Run tagged tests:

```bash
npm run test:tags "@smoke and @login"
cross-env TAGS="@smoke" npm test
```

## Hooks

- `BeforeAll` — framework init, report directories.
- `Before` — create context + page per scenario.
- `After` — capture artifacts on failure, close context.
- `AfterAll` — close shared browser.

## Parallel Execution

- Set `WORKERS=4` (or use `npm run test:parallel`).
- Scenarios must be fully isolated — no shared state.
- Each worker process gets its own browser instance.

## Reporting

- Allure reporter is configured in `cucumber.js`.
- Feature, scenario, and tags appear automatically in Allure.
- Failure artifacts attached via Cucumber `attach()` API.
