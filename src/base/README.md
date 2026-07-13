# Base Layer

## Purpose

Reusable foundation classes that all page objects build upon. Eliminates duplication of Playwright interactions and assertions.

## Contents

| File                | Responsibility                                              |
| ------------------- | ----------------------------------------------------------- |
| `BaseActions.ts`    | Generic Playwright interactions (click, fill, wait, scroll) |
| `BaseAssertions.ts` | Generic verifications (text, URL, visibility, count)        |
| `BasePage.ts`       | Composes actions + assertions + logger for page objects     |

## Coding Standards

- Methods must be generic — no page-specific logic.
- Every action logs before executing.
- Use explicit waits only — never `waitForTimeout()`.
- New methods added only when reused by 3+ page objects.

## Example

```typescript
export class LoginPage extends BasePage {
  async clickLogin(): Promise<void> {
    await this.actions.click(this.locators.loginButton, 'Login button');
  }
}
```

## Related

- [Page Object Guidelines](../../.cursor/rules/page-object-guidelines.md)
- [Base Class Guidelines](../../.cursor/rules/base-class-guidelines.md)
