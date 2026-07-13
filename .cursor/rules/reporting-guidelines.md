# Reporting Guidelines

## Allure Report

Primary reporting tool. Configured in `cucumber.js` via `allure-cucumberjs/reporter`.

## Automatic Metadata

| Field       | Source                   |
| ----------- | ------------------------ |
| Feature     | Cucumber feature name    |
| Scenario    | Cucumber scenario name   |
| Tags        | Cucumber tags            |
| Browser     | `environment.properties` |
| Environment | `environment.properties` |
| Base URL    | `environment.properties` |

## Failure Artifacts

On scenario failure, hooks automatically attach:

1. **Screenshot** — full-page PNG
2. **Video** — WebM (when `RECORD_VIDEO=true`)
3. **Playwright Trace** — ZIP (when `ENABLE_TRACING=true`)
4. **Failure details** — scenario name, status, message

## Commands

```bash
npm test                  # Run tests (generates allure-results)
npm run allure:generate   # Build HTML report
npm run allure:open       # Open report in browser
npm run report            # Generate + open
```

## Output Locations

| Artifact           | Path                               |
| ------------------ | ---------------------------------- |
| Allure results     | `src/reports/allure-results/`      |
| Allure HTML report | `src/reports/allure-report/`       |
| Cucumber JSON      | `src/reports/cucumber-report.json` |
| Screenshots        | Attached to Allure (on failure)    |
| Videos             | `src/reports/videos/`              |
| Traces             | `src/reports/traces/`              |

## CI/CD

1. Run tests in parallel with `WORKERS=4`.
2. Upload `src/reports/allure-results/` as CI artifact.
3. Generate report in pipeline or use Allure TestOps.

## Performance Tuning

For faster CI runs when artifacts are not needed:

```bash
ENABLE_TRACING=false RECORD_VIDEO=false WORKERS=4 npm test
```

Screenshots on failure remain enabled regardless.
