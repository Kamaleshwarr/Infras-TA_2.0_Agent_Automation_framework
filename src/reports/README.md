# Reports

## Purpose

Output directory for generated test artifacts. Contents are gitignored except `.gitkeep`.

## Generated Artifacts

| Path | Description |
|------|-------------|
| `allure-results/` | Raw Allure result JSON |
| `allure-report/` | Generated HTML report |
| `cucumber-report.json` | Cucumber JSON output |
| `screenshots/` | Failure screenshots |
| `videos/` | Scenario video recordings |
| `traces/` | Playwright trace files |

## Commands

```bash
npm test                  # Generates allure-results
npm run allure:generate   # Builds HTML report
npm run allure:open       # Opens report
```

## CI/CD

Upload `allure-results/` as a pipeline artifact. See [docs/allure-reporting.md](../../docs/allure-reporting.md).

## Related

- [Reporting Guidelines](../../.cursor/rules/reporting-guidelines.md)
