# Folder Structure

Detailed breakdown of the project layout.

## Root

```
.
├── .cursor/              # AI knowledge base & coding standards
├── docs/                 # User-facing documentation
├── src/                  # Framework source code
├── cucumber.js           # Cucumber + Allure configuration
├── tsconfig.json         # Strict TypeScript settings
├── package.json          # Scripts and dependencies
├── .env.example          # Environment template
├── CONTRIBUTING.md       # Contribution guide
└── README.md             # Project overview
```

## Source (`src/`)

| Folder             | Purpose                                 | README                                     |
| ------------------ | --------------------------------------- | ------------------------------------------ |
| `base/`            | Reusable actions, assertions, page base | [README](../src/base/README.md)            |
| `config/`          | Environment and Playwright config       | [README](../src/config/README.md)          |
| `constants/`       | Enums, routes, timeouts                 | [README](../src/constants/README.md)       |
| `locators/`        | Page selectors only                     | [README](../src/locators/README.md)        |
| `pages/`           | Business actions (POM)                  | [README](../src/pages/README.md)           |
| `stepdefinitions/` | Cucumber step glue                      | [README](../src/stepdefinitions/README.md) |
| `hooks/`           | Browser lifecycle & artifacts           | [README](../src/hooks/README.md)           |
| `features/`        | Gherkin feature files                   | [README](../src/features/README.md)        |
| `utils/`           | Logger, test data, Allure helpers       | [README](../src/utils/README.md)           |
| `testdata/`        | JSON test inputs                        | [README](../src/testdata/README.md)        |
| `reports/`         | Generated report artifacts              | [README](../src/reports/README.md)         |
| `resources/`       | Static test files                       | [README](../src/resources/README.md)       |
| `api/`             | Future API testing                      | [README](../src/api/README.md)             |
| `database/`        | Future DB utilities                     | [README](../src/database/README.md)        |
| `performance/`     | Future performance testing              | [README](../src/performance/README.md)     |
| `visual/`          | Future visual regression                | [README](../src/visual/README.md)          |
| `accessibility/`   | Future a11y testing                     | [README](../src/accessibility/README.md)   |

## Module Pattern

Each feature module spans multiple folders:

```
locators/LoginLocators.ts
pages/LoginPage.ts
features/login.feature
stepdefinitions/login.steps.ts
testdata/login.json
```

See [`.cursor/prompts/create-new-module.md`](../.cursor/prompts/create-new-module.md) for the full checklist.
