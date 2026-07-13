# Enums

## Purpose

Reusable typed enums replacing hardcoded string literals throughout the framework.

## Enums

| Enum            | Values                                                   |
| --------------- | -------------------------------------------------------- |
| `BrowserType`   | chromium, chrome, firefox, edge, webkit                  |
| `Environment`   | DEV, QA, UAT, PROD                                       |
| `ExecutionMode` | headless, headed, parallel, cross-browser, retry         |
| `LogLevel`      | DEBUG, INFO, WARN, ERROR                                 |
| `WaitStrategy`  | visible, hidden, load, networkidle, etc.                 |
| `TagType`       | @smoke, @regression, @sanity, @critical, @ui, @api, @wip |
| `ReportType`    | allure, cucumber-json                                    |

## Usage

```typescript
import { BrowserType, Environment, TagType } from '../enums';

process.env.BROWSER = BrowserType.FIREFOX;
process.env.ENV = Environment.QA;
const tags = TagType.SMOKE;
```

## Standards

- Never hardcode strings that exist as enums.
- Add new enum values here before using in code.
