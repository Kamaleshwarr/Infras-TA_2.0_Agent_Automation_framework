# Reports

## Purpose

Output directory for generated test artifacts. Contents are gitignored except `.gitkeep`.

## Generated Artifacts

| Path | Description |
|------|-------------|
| `allure-results/` | Raw Allure result JSON (**cleaned before each test execution**) |
| `allure-report/` | Generated HTML report (regenerated from current `allure-results/`) |
| `cucumber-report.json` | Cucumber JSON output (overwritten each run) |
| `screenshots/` | Failure screenshots |
| `videos/` | Scenario video recordings |
| `traces/` | Playwright trace files |

## Commands

```bash
npm test                  # Cleans allure-results, then runs Cucumber
npm run allure:generate   # Builds HTML report from current allure-results
npm run allure:open       # Opens report
```

## CI/CD

Upload `allure-results/` as a pipeline artifact. See [docs/allure-reporting.md](../../docs/allure-reporting.md).

## Related

- [Reporting Guidelines](../../.cursor/rules/reporting-guidelines.md)
