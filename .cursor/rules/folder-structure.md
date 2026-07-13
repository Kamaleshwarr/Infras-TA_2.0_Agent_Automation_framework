# Folder Structure

## Root Layout

```
.
├── .cursor/              # AI knowledge base & project standards
├── docs/                 # User-facing documentation
├── src/                  # Framework source code
├── cucumber.js           # Cucumber configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies & npm scripts
├── .env.example          # Environment template
├── CONTRIBUTING.md       # Contribution guidelines
└── README.md             # Project overview
```

## Source Layout (`src/`)

```
src/
├── base/             # BaseActions, BaseAssertions, BasePage
├── config/           # environment.config.ts, playwright.config.ts
├── constants/        # Enums, routes, timeouts, report paths
├── locators/         # One locator file per page (selectors only)
├── pages/            # One page class per page (business actions)
├── stepdefinitions/  # Cucumber step glue (no Playwright)
├── hooks/            # World, hooks, browserManager
├── features/         # Gherkin .feature files
├── utils/            # Logger, test data loader, Allure helper
├── testdata/         # JSON test data
├── reports/          # Generated reports (gitignored artifacts)
└── resources/        # Static files (uploads, fixtures)
```

## Module Pattern

Each application module requires:

```
locators/ModuleLocators.ts
pages/ModulePage.ts
features/module.feature
stepdefinitions/module.steps.ts
testdata/module.json
```

## Naming

- Locators: `{Page}Locators.ts`
- Pages: `{Page}Page.ts`
- Features: `{module}.feature`
- Steps: `{module}.steps.ts`
- Test data: `{module}.json`

Every folder under `src/` must contain a `README.md`.
