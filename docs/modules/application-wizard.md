# Application Wizard Module

## Purpose

Automates **page 1** of the Transamerica Application Wizard (Licensing and Appointment) reached via Dashboard → Create New Application.

## Responsibilities

| Method                                      | Description                       |
| ------------------------------------------- | --------------------------------- |
| `verifyWizardPageOneDisplayed()`            | Confirms wizard page 1 is visible |
| `verifyWizardStepIndicator()`               | Validates the step heading text   |
| `fillWizardPageOne()`                       | Enters wizard page 1 field values |
| `verifyWizardPageOnePrefilledAgentNumber()` | Validates prefilled agent data    |

## Files

| File                           | Location                                          |
| ------------------------------ | ------------------------------------------------- |
| `ApplicationWizardLocators.ts` | `src/locators/ApplicationWizardLocators.ts`       |
| `ApplicationWizardPage.ts`     | `src/pages/ApplicationWizardPage.ts`              |
| Test data                      | `src/testdata/create-application.json`            |
| Feature                        | `src/features/create-application.feature`         |
| Steps                          | `src/stepdefinitions/create-application.steps.ts` |

## Locator Strategy

Locators use Playwright role and label selectors aligned with the iGO e-App Licensing and Appointment screen. Validate and refine selectors against your target UAT environment when portal markup differs.

## Prerequisites

- Valid agent credentials via `AGENT_USERNAME` and `AGENT_PASSWORD`
- Successful login and dashboard navigation
- Scenarios tagged `@requires-credentials`

## Assumptions

- Wizard page 1 field labels include Product Type, Application State, Agent #, Office #, and Second Agent.
- Prefilled agent number assertions use values from `create-application.json` and must match the authenticated agent in UAT.

## Next Steps

- Application Wizard page 2 (Applicant Information)
- Navigation actions (Continue / Next) between wizard pages

## Related

- [Dashboard Module](dashboard.md)
- [Login Module](login.md)
