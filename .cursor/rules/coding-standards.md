# Coding Standards

## Language & Style

- **Strict TypeScript** — `strict: true` in `tsconfig.json`; no `any` unless justified.
- **Async/Await only** — no callback-based Playwright or Node APIs.
- **No hardcoded waits** — never use `waitForTimeout()`; use locator waits, `expect`, or load states.
- **Meaningful names** — methods describe business intent (`login()`, not `clickBtn()`).

## File Responsibilities

| File Type        | Allowed                                    | Forbidden                                          |
| ---------------- | ------------------------------------------ | -------------------------------------------------- |
| Locators         | Selector definitions                       | Business logic, assertions                         |
| Pages            | Business actions, page-level verifications | Inline selectors, direct `expect` in complex flows |
| Step definitions | Cucumber step mappings                     | Playwright API calls                               |
| Base classes     | Reusable actions/assertions                | Page-specific logic                                |
| Hooks            | Lifecycle, artifacts                       | Business logic                                     |

## Error Handling

- Let Playwright timeouts surface naturally for debugging.
- Wrap only when adding meaningful context (log + rethrow).
- Never swallow errors silently.

## Imports

- Use relative imports within `src/`.
- Group imports: external → internal → local.

## Comments

- Code should be self-explanatory.
- Comment only non-obvious business rules or framework behavior.
- Every new folder/module must have a `README.md`.

## Documentation Requirement

Before merging any feature:

1. Update related `README.md` files.
2. Update `.cursor/rules/` if standards change.
3. Update `docs/` if user-facing behavior changes.

Documentation is part of the deliverable.
