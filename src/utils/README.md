# Utilities

## Purpose

Shared helper classes used across the framework.

## Contents

| File                | Responsibility                                         |
| ------------------- | ------------------------------------------------------ |
| `logger.ts`         | Structured console logging with levels                 |
| `testDataLoader.ts` | Load JSON test data from `testdata/`                   |
| `allureHelper.ts`   | Allure environment properties and artifact attachments |

## Coding Standards

- Utilities must be stateless or use clear singleton patterns.
- No page-specific or application-specific logic.
- Document new utilities in this README.

## Examples

```typescript
// Logging
const logger = createLogger('MyComponent');
logger.info('Action performed');

// Test data
const data = TestDataLoader.load<LoginTestData>('login.json');

// Allure
AllureHelper.writeEnvironmentProperties();
```

## Related

- [Logging Guidelines](../../.cursor/rules/logging-guidelines.md)
- [Reporting Guidelines](../../.cursor/rules/reporting-guidelines.md)
