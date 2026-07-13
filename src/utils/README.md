# Utilities

Organized helper modules by category.

## Structure

```
utils/
├── common/       # Logger, retry helper
├── json/         # JSON test data loader
├── report/       # Allure report manager
└── string/       # Masking and sanitization (security)
```

## Modules

| Path                            | Purpose                          |
| ------------------------------- | -------------------------------- |
| `common/logger.ts`              | Winston ILogger implementation   |
| `common/retryHelper.ts`         | Transient failure retry          |
| `json/jsonDataProvider.ts`      | JSON file data provider          |
| `report/allureReportManager.ts` | IReportManager + Allure metadata |
| `string/maskHelper.ts`          | Sensitive value masking          |

## Security

- `maskHelper.ts` masks passwords/secrets in logs and reports.
- Never log or attach credential values.

## Related

- [interfaces/README.md](../interfaces/README.md)
- [exceptions/README.md](../exceptions/README.md)
