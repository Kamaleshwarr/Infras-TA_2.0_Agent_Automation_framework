# Exceptions

## Purpose

Dedicated exception hierarchy for meaningful, typed error handling across the framework.

## Classes

| Exception                   | Code                      | When Thrown                         |
| --------------------------- | ------------------------- | ----------------------------------- |
| `FrameworkException`        | —                         | Base class for all framework errors |
| `BrowserLaunchException`    | `BROWSER_LAUNCH_FAILED`   | Browser fails to launch             |
| `ConfigurationException`    | `CONFIGURATION_ERROR`     | Invalid env/config values           |
| `ElementNotFoundException`  | `ELEMENT_NOT_FOUND`       | Element not found/interactable      |
| `TestDataException`         | `TEST_DATA_ERROR`         | Test data load/parse failures       |
| `ReportGenerationException` | `REPORT_GENERATION_ERROR` | Allure/report write failures        |

## Usage

```typescript
import { ConfigurationException } from '../exceptions';

throw new ConfigurationException('Invalid ENV value');
```

## Standards

- Prefer custom exceptions over generic `throw new Error()`.
- Include error `code` for programmatic handling.
- Pass original error as `cause` when wrapping.
