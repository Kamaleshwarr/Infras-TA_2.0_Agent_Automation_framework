# Constants

## Purpose

Shared enums, routes, timeouts, and report paths used across the framework.

## Contents

| Export               | Description                                  |
| -------------------- | -------------------------------------------- |
| `Environment`        | DEV, QA, UAT, PROD enum                      |
| `ENVIRONMENT_URLS`   | Default URL per environment                  |
| `SUPPORTED_BROWSERS` | chromium, firefox, webkit                    |
| `DEFAULT_TIMEOUTS`   | Test, action, navigation timeouts            |
| `REPORT_PATHS`       | Allure, screenshot, video, trace directories |
| `ROUTES`             | Application route paths                      |

## Coding Standards

- Constants only — no functions or business logic (except type exports).
- Update when new environments or routes are added.
- Document changes in `docs/configuration.md`.

## Related

- [src/config/README.md](../config/README.md)
