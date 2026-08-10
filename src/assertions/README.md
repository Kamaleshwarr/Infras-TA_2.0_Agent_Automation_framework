# Assertions Layer

Module-specific assertion classes live here.

## Pattern

```
Step Definition → ModuleAssertions → BaseAssertions → Playwright expect
```

Each module assertions class:

- Uses module locators for reads
- Delegates comparisons to `BaseAssertions`
- Records Expected/Actual/Result attachments through `AllureReportManager.attachAssertionResult`

## Current Modules

| Module | File                 |
| ------ | -------------------- |
| Login  | `LoginAssertions.ts` |
