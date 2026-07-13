# Coding Standards

Summary of framework coding standards. Full details in [`.cursor/rules/`](../.cursor/rules/coding-standards.md).

## TypeScript

- Strict mode enabled — no implicit `any`.
- Async/await exclusively — no callbacks.
- Strong typing for all public methods and interfaces.

## Waits

| Allowed | Forbidden |
|---------|-----------|
| `locator.waitFor()` | `waitForTimeout()` |
| `expect(locator)` | `setTimeout()` / sleep |
| `waitForLoadState()` | Arbitrary delays |
| `waitForURL()` | |
| `waitForResponse()` | |

## Separation of Concerns

| Layer | Contains | Must Not Contain |
|-------|----------|------------------|
| Locators | Selectors | Logic, assertions |
| Pages | Business actions | Inline selectors |
| Steps | Cucumber mappings | Playwright API |
| Base classes | Generic actions/assertions | Page-specific code |

## Naming

- Pages: `{Name}Page.ts`
- Locators: `{Name}Locators.ts`
- Methods: business language (`login()`, not `clickBtn()`)

## Documentation

Every new folder or module requires a `README.md`. See [Documentation Guidelines](../.cursor/rules/documentation-guidelines.md).

## Review

Use the [Code Review Checklist](../.cursor/prompts/code-review-checklist.md) before submitting PRs.
