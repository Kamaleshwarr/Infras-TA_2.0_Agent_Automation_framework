# Prompt: Create New Module

Use this checklist when adding a new application module (e.g., Dashboard, Customer, Policy).

## Pre-Implementation

1. Read `.cursor/rules/architecture.md` and `.cursor/rules/folder-structure.md`.
2. Confirm Login module as reference template.
3. Create/update documentation **before** writing code.

## Documentation Tasks

- [ ] Create `src/locators/README.md` entry (or update existing)
- [ ] Create `src/pages/README.md` entry
- [ ] Create `src/features/README.md` entry
- [ ] Create `src/stepdefinitions/README.md` entry
- [ ] Create `src/testdata/README.md` entry
- [ ] Update `docs/folder-structure.md` if needed

## Implementation Tasks

### 1. Locators

```
src/locators/{Module}Locators.ts
```

- Selectors only, no logic.

### 2. Page

```
src/pages/{Module}Page.ts
```

- Extend `BasePage`.
- Business methods only.

### 3. Test Data

```
src/testdata/{module}.json
```

- No hardcoded credentials in code.

### 4. Feature

```
src/features/{module}.feature
```

- Tags: `@smoke`, `@regression`, `@{module}`.
- Independent scenarios.

### 5. Step Definitions

```
src/stepdefinitions/{module}.steps.ts
```

- No Playwright imports.
- Delegate to page via `CustomWorld`.

### 6. World Registration

Update `src/hooks/world.ts`:

```typescript
{module}Page!: {Module}Page;

initializePages(): void {
  this.{module}Page = new {Module}Page(this.page);
}
```

## Verification

```bash
npm run lint
npm test
npm run test:tags "@{module}"
```

## Post-Implementation

- [ ] All README files updated
- [ ] `.env.example` unchanged (unless new config needed)
- [ ] PR includes docs + code
