# Locator Guidelines

## Purpose

Locator files contain **selectors only**. They map UI elements to Playwright locators with zero business logic.

## Rules

1. One locator file per application page: `LoginLocators.ts`.
2. Class receives `Page` via constructor — no static locators.
3. Use getter properties for each element.
4. No methods that perform actions or assertions.
5. No imports from pages, steps, or base classes (except `Page` from Playwright).

## Structure

```typescript
export class LoginLocators {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.locator('#user-name');
  }

  get loginButton() {
    return this.page.locator('#login-button');
  }
}
```

## Selector Priority

1. `data-test` / `data-testid`
2. `getByRole()` with accessible name
3. `getByLabel()`
4. Stable CSS / ID

## Naming

- Getter names describe the element's purpose: `usernameInput`, `errorMessage`, `submitButton`.
- Avoid generic names: `button1`, `div2`.

## Maintenance

When UI changes, update **only** the locator file. Page and step files remain unchanged.

## Anti-Patterns

- Business logic or conditional selector resolution in locators.
- Copy-pasting selectors into page classes.
- XPath unless no stable alternative exists.
