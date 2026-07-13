# Pages

## Purpose

Page Object classes containing **business actions only**. Each page imports locators — never defines selectors inline.

## Current Files

| File           | Description                                                |
| -------------- | ---------------------------------------------------------- |
| `LoginPage.ts` | Login actions and verifications (reference implementation) |

## Coding Standards

- Extend `BasePage`.
- Import locators from `../locators/`.
- Methods use business language: `login()`, `verifyDashboardDisplayed()`.
- Delegate interactions to `this.actions`, verifications to `this.assertions`.
- Register new pages in `src/hooks/world.ts`.

## Reference: LoginPage

```typescript
await this.loginPage.openLoginPage();
await this.loginPage.login({ username: '...', password: '...' });
await this.loginPage.verifySuccessfulLogin();
```

## Adding a New Page

See [Create New Page](../../.cursor/prompts/create-new-page.md).

## Related

- [Page Object Guidelines](../../.cursor/rules/page-object-guidelines.md)
- [src/locators/README.md](../locators/README.md)
