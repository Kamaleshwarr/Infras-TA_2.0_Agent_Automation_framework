# Login Module

## Purpose

Authenticates agents against the **Transamerica Agent Portal QA SPA** at `https://agent-portal-qa-20.ilifeta.com/`.

## Files

| File                 | Location                             |
| -------------------- | ------------------------------------ |
| `LoginLocators.ts`   | `src/locators/LoginLocators.ts`      |
| `LoginPage.ts`       | `src/pages/LoginPage.ts`             |
| `LoginAssertions.ts` | `src/assertions/LoginAssertions.ts`  |
| Test data            | `src/testdata/login.json`            |
| Feature              | `src/features/login.feature`         |
| Steps                | `src/stepdefinitions/login.steps.ts` |

## Locators

| Element               | Selector                                           |
| --------------------- | -------------------------------------------------- |
| Email                 | `#field-email`                                     |
| Password              | `#field-password`                                  |
| Sign in               | role button `/sign in/i`                           |
| Forgot password       | role button `/forgot password/i`                   |
| Email field error     | `#field-email-error`                               |
| Password field error  | `#field-password-error`                            |
| Authentication banner | `[role="alert"]` filtered by `Invalid credentials` |

## Credentials

| Variable         | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| `AGENT_USERNAME` | Valid agent email for `@requires-credentials` scenarios    |
| `AGENT_PASSWORD` | Valid agent password for `@requires-credentials` scenarios |

Invalid-login data and expected messages live in `src/testdata/login.json`.

## Execution

```bash
npm run test:tags "@login"
npm run test:tags "@login and @positive"
npm run test:tags "@login and @validation"
npm run test:tags "@login and @negative"
```

## Related

- [Dashboard Module](dashboard.md)
- [Configuration Guide](../configuration.md)
