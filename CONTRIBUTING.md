# Contributing

Thank you for contributing to the Playwright BDD Automation Framework.

## Documentation-First Rule

**Documentation is part of every deliverable.** Before implementing:

1. Check if documentation exists for your target area.
2. Update existing docs if behavior will change.
3. Create docs for new components.
4. Then implement code.

## Getting Started

1. Fork / clone the repository.
2. Install dependencies: `npm install`
3. Copy environment: `cp .env.example .env`
4. Create a feature branch: `git checkout -b cursor/your-feature-2a13`
5. Make changes (code + docs).
6. Verify: `npm run lint && npm test`
7. Push and open a PR.

## What to Include in Every PR

- [ ] Code changes
- [ ] Updated or new `README.md` files
- [ ] Updated `docs/` if user-facing behavior changed
- [ ] Updated `.env.example` if new config added
- [ ] Passing `npm run lint` and `npm test`

## Coding Standards

Follow [docs/coding-standards.md](docs/coding-standards.md) and [`.cursor/rules/`](.cursor/rules/).

Key rules:

- No Playwright in step definitions
- No selectors in page classes
- No `waitForTimeout()`
- Strict TypeScript

## Adding a New Module

Use the checklist: [`.cursor/prompts/create-new-module.md`](.cursor/prompts/create-new-module.md)

## Code Review

Reviewers use: [`.cursor/prompts/code-review-checklist.md`](.cursor/prompts/code-review-checklist.md)

## Commit Messages

```
feat: add dashboard module with smoke scenarios
fix: correct login error message assertion
docs: add parallel execution guide
refactor: share browser per worker via BrowserManager
```

## Questions

See [docs/faq.md](docs/faq.md) or [docs/troubleshooting.md](docs/troubleshooting.md).
