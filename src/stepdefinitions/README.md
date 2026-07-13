# Step Definitions

## Purpose

Cucumber step glue that maps Gherkin steps to page object methods.

## Current Files

| File | Feature |
|------|---------|
| `login.steps.ts` | Login feature steps |

## Coding Standards

- **Never** import or use Playwright directly.
- Access page objects via `CustomWorld` (`this.loginPage`).
- Keep steps thin — one action or verification per step.
- Load test data from `testdata/` via `TestDataLoader`.
- Reuse steps across features where possible.

## Example

```typescript
When('the user logs in with valid credentials', async function (this: CustomWorld) {
  await this.loginPage.login(loginData.validUser);
});
```

## Adding New Steps

1. Create `{module}.steps.ts`.
2. Auto-loaded via `cucumber.js` glob pattern.
3. See [Create New Feature](../../.cursor/prompts/create-new-feature.md).

## Related

- [Cucumber Best Practices](../../.cursor/rules/cucumber-best-practices.md)
- [src/features/README.md](../features/README.md)
