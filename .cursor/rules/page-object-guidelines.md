# Page Object Guidelines

## Purpose

Page classes encapsulate **business actions** for a single application page or cohesive UI section.

## Rules

1. Extend `BasePage` for actions, assertions, and logging.
2. Import locators from `locators/` — never define selectors inline.
3. Methods use business language: `login()`, `logout()`, `createPolicy()`.
4. No raw Playwright calls — delegate to `this.actions` and `this.assertions`.
5. One page class per application page.

## Structure

```typescript
export class LoginPage extends BasePage {
  private readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page, 'LoginPage');
    this.locators = new LoginLocators(page);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.actions.fill(
      this.locators.usernameInput,
      credentials.username,
      'Username',
    );
    await this.actions.fill(
      this.locators.passwordInput,
      credentials.password,
      'Password',
    );
    await this.actions.click(this.locators.loginButton, 'Login button');
  }
}
```

## Verifications

- Page-level verification methods are allowed: `verifyLoginPageDisplayed()`.
- Implementation uses `this.assertions` — not inline `expect()`.

## Registration

When adding a new page:

1. Create locator file.
2. Create page class.
3. Register in `CustomWorld.initializePages()`.
4. Document in `pages/README.md`.

## Anti-Patterns

- God page objects spanning multiple unrelated pages.
- Assertions in step definitions instead of page methods.
- Hardcoded URLs or credentials in page classes.
