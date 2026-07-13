# Features

## Purpose

Gherkin `.feature` files — living documentation and BDD test scenarios.

## Current Files

| File            | Module     | Tags                                         |
| --------------- | ---------- | -------------------------------------------- |
| `login.feature` | User Login | `@login`, `@smoke`, `@positive`, `@negative` |

## Coding Standards

- One feature per application capability.
- Use tags for CI filtering.
- Scenarios must be independent — no execution order dependencies.
- Use `Background` for shared preconditions.
- Use `Scenario Outline` for data-driven tests.

## Example

```gherkin
@login @smoke
Feature: User Login
  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user logs in with valid credentials
    Then the user should be redirected to the inventory page
```

## Running

```bash
npm run test:tags "@login"
npm run test:smoke
```

## Related

- [Create New Feature](../../.cursor/prompts/create-new-feature.md)
- [Cucumber Best Practices](../../.cursor/rules/cucumber-best-practices.md)
