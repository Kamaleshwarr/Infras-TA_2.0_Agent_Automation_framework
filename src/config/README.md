# Configuration

## Purpose

Centralized runtime configuration for environments, browsers, and Playwright settings.

## Contents

| File | Responsibility |
|------|----------------|
| `environment.config.ts` | Reads `.env` / process env; resolves URLs, timeouts, workers |
| `playwright.config.ts` | Browser launch options, context options, artifact paths |

## Coding Standards

- No hardcoded values — everything from environment variables or constants.
- Validate inputs and throw clear errors for invalid config.
- Update `.env.example` and `docs/configuration.md` when adding variables.

## Usage

```typescript
import { getEnvironmentConfig } from '../config/environment.config';

const config = getEnvironmentConfig();
console.log(config.baseUrl, config.headless);
```

## Related

- [docs/configuration.md](../../docs/configuration.md)
- [src/constants/README.md](../constants/README.md)
