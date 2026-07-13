# Allure Reporting

## Overview

Allure Report provides rich HTML reports with scenario details, tags, environment info, and failure artifacts.

## Generate Report

After running tests:

```bash
# Generate HTML report
npm run allure:generate

# Open in browser
npm run allure:open

# Generate and open in one step
npm run report
```

## What's Included

| Metadata | Source |
|----------|--------|
| Feature name | Cucumber feature |
| Scenario name | Cucumber scenario |
| Tags | Cucumber tags |
| Browser | Environment config |
| Environment (DEV/QA/UAT/PROD) | Environment config |
| Execution time | Allure automatic |

## Failure Artifacts

Automatically attached on scenario failure:

1. **Screenshot** — full-page capture
2. **Video** — WebM recording (when `RECORD_VIDEO=true`)
3. **Playwright Trace** — ZIP file (when `ENABLE_TRACING=true`)
4. **Failure details** — error message and status

### View Playwright Trace

1. Download the trace ZIP from Allure attachments.
2. Open at [trace.playwright.dev](https://trace.playwright.dev).

## Output Paths

| Output | Location |
|--------|----------|
| Raw results | `src/reports/allure-results/` |
| HTML report | `src/reports/allure-report/` |
| Cucumber JSON | `src/reports/cucumber-report.json` |

## CI Integration

```yaml
- run: npm test
- uses: actions/upload-artifact@v4
  with:
    name: allure-results
    path: src/reports/allure-results/
- run: npm run allure:generate
```

## Performance Tuning

For faster runs when artifacts aren't needed:

```bash
ENABLE_TRACING=false RECORD_VIDEO=false npm test
```

See [Configuration](configuration.md) for all options.
