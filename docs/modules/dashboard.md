# Dashboard Module

## Purpose

Lightweight navigation layer for the Transamerica Agent Portal **Agent Home** dashboard. This module exists only to launch the Create New Application workflow.

## Responsibilities

| Method                        | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| `verifyDashboardLoaded()`     | Confirms the dashboard is ready for navigation |
| `clickCreateNewApplication()` | Launches the Application Wizard                |

## Files

| File                   | Location                                          |
| ---------------------- | ------------------------------------------------- |
| `DashboardLocators.ts` | `src/locators/DashboardLocators.ts`               |
| `DashboardPage.ts`     | `src/pages/DashboardPage.ts`                      |
| Feature                | `src/features/create-application.feature`         |
| Steps                  | `src/stepdefinitions/create-application.steps.ts` |

## Out of Scope

The following dashboard capabilities are intentionally **not** automated in this module:

- Applications table
- Pagination, search, filters, sorting
- Progress indicators
- Actions menu

These will be implemented in future modules when required.

## Prerequisites

Authenticated scenarios require `AGENT_USERNAME` and `AGENT_PASSWORD` environment variables. Scenarios tagged `@requires-credentials` are skipped when credentials are not configured.

## Usage

```typescript
await this.dashboardPage.verifyDashboardLoaded();
await this.dashboardPage.clickCreateNewApplication();
```

## Related

- [Application Wizard Module](application-wizard.md)
- [Login Module](login.md)
