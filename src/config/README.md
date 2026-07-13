# Configuration

Centralized runtime configuration for environments, browsers, and Playwright settings.

## Contents

| File                    | Responsibility                      |
| ----------------------- | ----------------------------------- |
| `envLoader.ts`          | Loads `.env.{env}` and `.env` files |
| `environment.config.ts` | Resolves all runtime settings       |
| `browserFactory.ts`     | Browser type and launch options     |
| `playwright.config.ts`  | Context options and artifact paths  |

## Environment Loading

```
ENV=QA  →  loads .env.qa  →  then .env  →  then process.env
```

## Browser Selection

`BrowserFactory` maps `BROWSER` env var to Playwright:

| BROWSER  | Implementation                 |
| -------- | ------------------------------ |
| chromium | Playwright Chromium            |
| chrome   | Chromium + `channel: 'chrome'` |
| firefox  | Playwright Firefox             |
| edge     | Chromium + `channel: 'msedge'` |
| webkit   | Playwright WebKit              |

## Adding Variables

1. Add to `.env.example` and all `.env.*` files.
2. Parse in `environment.config.ts`.
3. Update `docs/configuration.md`.

## Related

- [docs/configuration.md](../../docs/configuration.md)
