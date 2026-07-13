# Naming Conventions

## Files

| Type             | Pattern             | Example            |
| ---------------- | ------------------- | ------------------ |
| Locator file     | `{Page}Locators.ts` | `LoginLocators.ts` |
| Page object      | `{Page}Page.ts`     | `LoginPage.ts`     |
| Feature file     | `{module}.feature`  | `login.feature`    |
| Step definitions | `{module}.steps.ts` | `login.steps.ts`   |
| Test data        | `{module}.json`     | `login.json`       |

## Classes

| Type      | Pattern           | Example                          |
| --------- | ----------------- | -------------------------------- |
| Locators  | `{Page}Locators`  | `LoginLocators`                  |
| Page      | `{Page}Page`      | `LoginPage`                      |
| Utilities | `{Purpose}{Type}` | `TestDataLoader`, `AllureHelper` |

## Methods (Pages)

Use **business language**, not UI mechanics:

| Good                         | Bad                  |
| ---------------------------- | -------------------- |
| `login()`                    | `clickLoginButton()` |
| `searchCustomer()`           | `typeInSearchBox()`  |
| `verifyDashboardDisplayed()` | `checkDivVisible()`  |

## Locator Properties

Use descriptive getter names matching the UI element:

```typescript
get usernameInput() { return this.page.locator('#user-name'); }
get submitApplicationButton() { return this.page.locator('[data-test="submit"]'); }
```

## Cucumber Steps

- **Given** — preconditions and setup
- **When** — actions
- **Then** — verifications

Use consistent actor naming: `the user`, `the admin`, `the system`.

## Environment Variables

- UPPER_SNAKE_CASE: `BASE_URL`, `HEADLESS`, `WORKERS`

## Git Branches

- Feature: `cursor/{descriptive-name}-{suffix}`
- Use lowercase kebab-case
