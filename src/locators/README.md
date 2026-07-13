# Locators

## Purpose

Page-specific selector definitions. **Selectors only — no business logic.**

## Current Files

| File | Page |
|------|------|
| `LoginLocators.ts` | Login page (Sauce Demo) |

## Coding Standards

- One file per application page: `{Page}Locators.ts`.
- Class constructor receives `Page`.
- Use getter properties for each element.
- No actions, assertions, or conditional logic.

## Example

```typescript
export class LoginLocators {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.locator('#user-name');
  }
}
```

## Adding a New Locator File

1. Create `{Page}Locators.ts`.
2. Update this README.
3. See [Locator Guidelines](../../.cursor/rules/locator-guidelines.md).

## Related

- [src/pages/README.md](../pages/README.md)
