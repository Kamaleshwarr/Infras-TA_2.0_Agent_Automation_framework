# Branching Strategy

## Branches

| Branch     | Purpose                              | Lifetime  |
| ---------- | ------------------------------------ | --------- |
| `main`     | Production-ready framework code      | Permanent |
| `cursor/*` | Feature / agent development branches | Temporary |

## Flow

```
main ──► cursor/new-module-2a13 ──► PR ──► merge to main
```

## Rules

1. Always branch from latest `main`.
2. One logical feature per branch (e.g., Login module, Dashboard module, docs update).
3. Keep branches short-lived.
4. Delete branch after merge.

## Naming Convention

```
cursor/{descriptive-name}-{suffix}
```

Examples:

- `cursor/playwright-automation-framework-2a13`
- `cursor/dashboard-module-2a13`
- `cursor/docs-standards-2a13`

## Parallel Development

Multiple engineers/agents can work on separate branches simultaneously. Each module should be an independent branch and PR to minimize conflicts.

## Hotfixes

For urgent fixes on `main`:

1. Branch from `main`: `cursor/fix-login-timeout-2a13`
2. Fix + test + document
3. Fast-track PR review

## CI Expectations

Every PR should pass:

- TypeScript compilation
- Full or tagged test suite
- Documentation review (manual)
