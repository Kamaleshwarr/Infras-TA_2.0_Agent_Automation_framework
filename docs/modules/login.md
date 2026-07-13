# Login Module

## Purpose

Authenticates agents against the **Transamerica Agent Portal** at `https://secure.transamerica.com`.

## Responsibilities

| Method                       | Description                                |
| ---------------------------- | ------------------------------------------ |
| `openLoginPage()`            | Navigates to the Agent Portal login screen |
| `login()`                    | Submits agent credentials                  |
| `verifyLoginPageDisplayed()` | Confirms the login form is visible         |
| `verifyLoginError()`         | Validates authentication error messages    |

## Files

| File               | Location                             |
| ------------------ | ------------------------------------ |
| `LoginLocators.ts` | `src/locators/LoginLocators.ts`      |
| `LoginPage.ts`     | `src/pages/LoginPage.ts`             |
| Test data          | `src/testdata/login.json`            |
| Feature            | `src/features/login.feature`         |
| Steps              | `src/stepdefinitions/login.steps.ts` |

## Locators

Production login selectors verified against `secure.transamerica.com`:

| Element       | Selector      |
| ------------- | ------------- |
| Username      | `#username`   |
| Password      | `#password`   |
| Login button  | `#formLogin`  |
| Error message | `#error-list` |

## Credentials

Never hardcode agent credentials in source code.

| Variable         | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `AGENT_USERNAME` | Valid agent username for authenticated scenarios |
| `AGENT_PASSWORD` | Valid agent password for authenticated scenarios |

Scenarios tagged `@requires-credentials` are skipped when these variables are not set. Invalid-login scenarios use disposable values from `login.json`.

## Related

- [Dashboard Module](dashboard.md)
- [Configuration Guide](../configuration.md)
