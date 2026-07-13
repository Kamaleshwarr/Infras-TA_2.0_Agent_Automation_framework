# Constants

Centralized constant values split by domain.

## Files

| File                      | Contents                                                    |
| ------------------------- | ----------------------------------------------------------- |
| `FrameworkConstants.ts`   | Framework name, version, viewport, sensitive field patterns |
| `TimeoutConstants.ts`     | Default timeouts, retry delay                               |
| `PathConstants.ts`        | Report paths and file names                                 |
| `ReportConstants.ts`      | Config keys, artifact defaults                              |
| `ApplicationConstants.ts` | URLs, routes, test data file names                          |
| `index.ts`                | Barrel export (backward compatible)                         |

## Usage

```typescript
import { ROUTES } from '../constants/ApplicationConstants';
import { REPORT_PATHS } from '../constants/PathConstants';
import { CONFIG_KEYS } from '../constants/ReportConstants';
```

## Standards

- No magic strings in page/hook/step files.
- Enums live in `src/enums/`; static values live here.
