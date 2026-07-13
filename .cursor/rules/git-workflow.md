# Git Workflow

## Branching

- Base branch: `main`
- Feature branches: `cursor/{descriptive-name}-{suffix}`
- Use lowercase kebab-case in branch names.

## Commit Messages

Use conventional commits:

```
feat: add dashboard page object and smoke scenarios
fix: resolve parallel worker browser leak
docs: update Allure reporting guide
refactor: extract browser manager from world
test: add negative login scenarios
```

## Pull Request Process

1. Create feature branch from `main`.
2. Implement code **and** documentation together.
3. Run `npm run lint` and `npm test` before pushing.
4. Push branch and open a PR.
5. Ensure PR description covers code and doc changes.
6. Request review; address feedback.
7. Squash or merge per team policy.

## Pre-Push Checklist

- [ ] TypeScript compiles (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Documentation updated
- [ ] `.env.example` updated if config changed
- [ ] No secrets committed

## What Not to Commit

- `.env` (local secrets)
- `node_modules/`
- Report artifacts (`src/reports/allure-results/`, etc.)
- Screenshots, videos, traces from local runs
