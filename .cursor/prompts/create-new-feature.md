# Prompt: Create New Feature

Use when adding BDD scenarios for a module.

## Steps

1. **Create feature file** — `src/features/{module}.feature`
2. **Create step definitions** — `src/stepdefinitions/{module}.steps.ts`
3. **Create/update test data** — `src/testdata/{module}.json`
4. **Update README** — `src/features/README.md`, `src/stepdefinitions/README.md`

## Feature Template

```gherkin
@{module} @smoke
Feature: {Capability Name}
  As a {role}
  I want to {action}
  So that {benefit}

  Background:
    Given the user is logged in

  @positive
  Scenario: {Happy path description}
    When the user performs {action}
    Then the user should see {expected result}
```

## Step Definition Template

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/world';

Given('the user is logged in', async function (this: CustomWorld) {
  await this.loginPage.openLoginPage();
  await this.loginPage.login(/* from test data */);
});
```

## Rules

- No Playwright code in steps.
- Reuse existing steps where possible.
- Tag appropriately for CI filtering.
- Scenarios must be independent.

## Run

```bash
npm run test:tags "@{module}"
```
