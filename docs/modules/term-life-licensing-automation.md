# Term Life — Licensing Module Automation Report

> Generated: 2026-08-11  
> Module scope: **Term Life → Licensing only** (no subsequent Application Form modules)  
> QA URL: `https://agent-portal-qa-20.ilifeta.com/`

## 1. Module Overview

The Licensing module is the first section of the Term Life application form. Automation validates state-driven flow resolution, common agent fields, flow-specific Agent Address / License Number behavior, field validation, Additional Agents conditional UI, navigation, and data persistence.

## 2. Scope

| In scope                                     | Out of scope                               |
| -------------------------------------------- | ------------------------------------------ |
| Term Life Licensing for 50 applicable states | Puerto Rico, Guam (Term Life unavailable)  |
| Four approved flow groups (A–D)              | Proposed Primary Insured and later modules |
| Representative-state scenarios               | Per-state duplicate scenarios              |
| Login (reused, not modified)                 | Application Creation behavior changes      |

## 3. 50-State Mapping

State → flow mapping is maintained in `src/testdata/licensing.json` (`stateFlowMapping`). All 50 Term Life-applicable locations are classified into FLOW_A (38), FLOW_B (5), FLOW_C (5), or FLOW_D (2).

## 4. Four Flow Groups

| Flow       | Description                     | Representative | States             |
| ---------- | ------------------------------- | -------------- | ------------------ |
| **FLOW_A** | Standard Agent Information only | Alabama        | 38 states          |
| **FLOW_B** | Agent Address + License Number  | California     | CA, FL, GA, IN, WY |
| **FLOW_C** | Agent Address only              | Delaware       | DE, MI, MN, PA, WA |
| **FLOW_D** | License Number only             | Missouri       | MO, OK             |

## 5. Representative States

| Flow   | Automated representative | Feature scenarios                                             |
| ------ | ------------------------ | ------------------------------------------------------------- |
| FLOW_A | Alabama                  | Structure, validation, conditional, persistence, Next, Return |
| FLOW_B | California               | Structure, License Number required                            |
| FLOW_C | Delaware                 | Structure                                                     |
| FLOW_D | Missouri                 | Structure, License Number required                            |

## 6. Complete Field Inventory

| Label                       | Field ID | Type        | Required        | Default | Disabled |
| --------------------------- | -------- | ----------- | --------------- | ------- | -------- |
| Writing Agent First Name    | 40127    | text        | Yes             | —       | No       |
| Writing Agent Last Name     | 40128    | text        | Yes             | —       | No       |
| Agent Number                | 40129    | text        | No              | —       | No       |
| Office Id                   | 41053    | text        | Yes             | —       | No       |
| Agent Profile               | 41052    | text        | No              | 001     | Yes      |
| Agent Email                 | 41018    | email       | Yes             | —       | No       |
| Phone Number                | 40130    | phonenumber | Yes             | —       | No       |
| Agent Percent               | 41084    | number      | Yes             | 100     | Yes      |
| Any Additional Agents?      | 41021    | radioswitch | Yes             | —       | No       |
| License Number              | 45242    | text        | Yes (Flows B/D) | —       | No       |
| Additional Agents card list | 41022    | cardlist    | Conditional     | —       | —        |

**Agent Address (Flows B/C):** Country, Address Line 1, Apartment/Unit, City, U.S. State/Territory, Zip Code.

## 7. Required / Optional Behavior

**Required (all flows):** Writing Agent First/Last Name, Office Id, Agent Email, Phone Number, Any Additional Agents?  
**Optional:** Agent Number, Agent Profile (read-only default)  
**Flow-specific required:** License Number (Flows B & D)  
**Automated:** Empty Next with Additional Agents = No → required messages on core fields; License Number required message on CA/MO.

## 8. Default Values

| Field         | Default | Verified       |
| ------------- | ------- | -------------- |
| Agent Profile | 001     | Yes (disabled) |
| Agent Percent | 100     | Yes (disabled) |

## 9. Disabled / Read-Only Fields

- Agent Profile (`41052`) — disabled, default `001`
- Agent Percent (`41084`) — disabled, default `100`

## 10. Min/Max Rules

No explicit min/max length messages were observed in QA for Licensing text fields during exploration. **Manual-only** until TAPD export or additional QA probes confirm limits.

## 11. Format Rules

| Field        | Rule               | Message                               | Automated     |
| ------------ | ------------------ | ------------------------------------- | ------------- |
| Agent Email  | Valid email format | `Please enter a valid email address`  | Yes (Alabama) |
| Office Id    | Numeric            | `Please enter a valid numeric value.` | Yes (Alabama) |
| Phone Number | Valid phone format | Not probed separately                 | Manual-only   |

## 12. Boundary Validations

Boundary min/max length scenarios are **manual-only** (no observed QA messages during exploration/probes).

## 13. Invalid Input Behavior

| Input                        | Expected behavior                | Automated    |
| ---------------------------- | -------------------------------- | ------------ |
| Empty required fields        | `Please fill the required field` | Yes          |
| Invalid email                | Email format message             | Yes          |
| Non-numeric Office Id        | Numeric message                  | Yes          |
| Missing License Number (B/D) | `License Number is required.`    | Yes (CA, MO) |

## 14. Validation Messages

| Message                               | Source                      |
| ------------------------------------- | --------------------------- |
| `Please fill the required field`      | QA exploration + live probe |
| `License Number is required.`         | QA exploration              |
| `Please enter a valid email address`  | Live QA probe               |
| `Please enter a valid numeric value.` | Live QA probe               |

## 15. License Number Behavior

| Flow | Present | Required message | Scenario            |
| ---- | ------- | ---------------- | ------------------- |
| A    | No      | N/A              | Alabama structure   |
| B    | Yes     | Yes              | California required |
| C    | No      | N/A              | Delaware structure  |
| D    | Yes     | Yes              | Missouri required   |

## 16. Agent Address Behavior

| Flow | Agent Address section | Scenario   |
| ---- | --------------------- | ---------- |
| A    | Absent                | Alabama    |
| B    | Present + labels      | California |
| C    | Present + labels      | Delaware   |
| D    | Absent                | Missouri   |

Address field required validation on Next is **manual-only** (not isolated in current automation).

## 17. Additional / Split Agent Behavior

- **Any Additional Agents? = No** → cardlist `41022` hidden
- **Yes** → cardlist visible
- **Yes → No** → cardlist hidden again

Scenario: _Term Life Licensing Additional Agents conditional behavior - Alabama_

## 18. Conditional Behavior

Only verified conditional: radioswitch `41021` → cardlist `41022`. Inner cardlist field validation is **manual-only**.

## 19. Next Behavior

| Case                  | Behavior                        | Scenario           |
| --------------------- | ------------------------------- | ------------------ |
| Empty required data   | Validation errors               | Alabama validation |
| Invalid format        | Field-level errors              | Alabama validation |
| Valid core data       | No required-field errors remain | Alabama valid Next |
| Missing License (B/D) | License required message        | CA, MO             |

## 20. Previous / Back Behavior

Licensing is **Page 1 of 1** in QA. Previous button is **disabled** on initial load (verified in flow structure scenarios).  
**Manual-only:** Previous → Next data retention on Licensing (Previous never enables).

## 21. Return to Applications Behavior

Return to Applications (`agp-form-button-back`) navigates to Applications dashboard.  
Scenario: _Term Life Licensing Return to Applications - Alabama_

## 22. Data Persistence

Persistence verified via **section navigation after valid Next** (QA persists Licensing data on Next; section-only navigation without Next does not retain values).

Flow: fill core data → Next → Proposed Primary Insured → Licensing → verify First Name, Office Id, Agent Email retained.

Scenario: _Term Life Licensing data persistence via section navigation - Alabama_

## 23. TAPD Reference Mapping

**No TAPD export file exists in this repository.** Rules are traced to QA exploration (`docs/modules/term-life-licensing-exploration.md`) and live probe evidence. Placeholder references use `QA-REF-*` until TAPD IDs are attached.

| QA-REF         | Business rule                 | Feature scenario                         |
| -------------- | ----------------------------- | ---------------------------------------- |
| QA-REF-LIC-001 | Required field on empty Next  | Required and format validation - Alabama |
| QA-REF-LIC-002 | Invalid email format          | Required and format validation - Alabama |
| QA-REF-LIC-003 | Office Id numeric             | Required and format validation - Alabama |
| QA-REF-LIC-004 | License Number required       | License Number required - CA/MO          |
| QA-REF-LIC-005 | Additional Agents conditional | Additional Agents conditional - Alabama  |
| QA-REF-LIC-006 | Flow A structure              | Flow structure - Alabama                 |
| QA-REF-LIC-007 | Flow B structure              | Flow structure - California              |
| QA-REF-LIC-008 | Flow C structure              | Flow structure - Delaware                |
| QA-REF-LIC-009 | Flow D structure              | Flow structure - Missouri                |
| QA-REF-LIC-010 | Valid Next acceptance         | Valid Next navigation - Alabama          |
| QA-REF-LIC-011 | Return to Applications        | Return to Applications - Alabama         |
| QA-REF-LIC-012 | Section-nav persistence       | Data persistence - Alabama               |
| QA-REF-LIC-013 | Previous disabled             | Flow structure (all representatives)     |

## 24. Feature Scenario Mapping

| #   | Scenario                         | State      | Resolved flow |
| --- | -------------------------------- | ---------- | ------------- |
| 1   | Flow structure - Alabama         | Alabama    | FLOW_A        |
| 2   | Flow structure - California      | California | FLOW_B        |
| 3   | Flow structure - Delaware        | Delaware   | FLOW_C        |
| 4   | Flow structure - Missouri        | Missouri   | FLOW_D        |
| 5   | Required and format validation   | Alabama    | FLOW_A        |
| 6   | Additional Agents conditional    | Alabama    | FLOW_A        |
| 7   | Data persistence via section nav | Alabama    | FLOW_A        |
| 8   | Valid Next navigation            | Alabama    | FLOW_A        |
| 9   | Return to Applications           | Alabama    | FLOW_A        |
| 10  | License Number required          | California | FLOW_B        |
| 11  | License Number required          | Missouri   | FLOW_D        |

**Total scenarios: 11**

## 25. Automation Coverage Matrix

| Area                      | Business rule          | Reference      | Feature scenario            | Automation | Status                        |
| ------------------------- | ---------------------- | -------------- | --------------------------- | ---------- | ----------------------------- |
| Flow A                    | No address/license     | QA-REF-LIC-006 | Flow structure - Alabama    | Yes        | See execution                 |
| Flow B                    | Address + license      | QA-REF-LIC-007 | Flow structure - California | Yes        | See execution                 |
| Flow C                    | Address only           | QA-REF-LIC-008 | Flow structure - Delaware   | Yes        | See execution                 |
| Flow D                    | License only           | QA-REF-LIC-009 | Flow structure - Missouri   | Yes        | See execution                 |
| Required fields           | Empty Next             | QA-REF-LIC-001 | Required/format - Alabama   | Yes        | See execution                 |
| Email                     | Format                 | QA-REF-LIC-002 | Required/format - Alabama   | Yes        | See execution                 |
| Office Id                 | Numeric                | QA-REF-LIC-003 | Required/format - Alabama   | Yes        | See execution                 |
| License Number            | Required B/D           | QA-REF-LIC-004 | License required CA/MO      | Yes        | See execution                 |
| Additional Agents         | Yes/No cardlist        | QA-REF-LIC-005 | Conditional - Alabama       | Yes        | See execution                 |
| Navigation                | Valid Next             | QA-REF-LIC-010 | Valid Next - Alabama        | Yes        | PASS                          |
| Navigation                | Return                 | QA-REF-LIC-011 | Return - Alabama            | Yes        | See execution                 |
| Persistence               | Section nav after Next | QA-REF-LIC-012 | Persistence - Alabama       | Yes        | PASS                          |
| Navigation                | Previous disabled      | QA-REF-LIC-013 | Flow structure (all)        | Yes        | See execution                 |
| Agent Address             | Required on Next (B/C) | —              | —                           | No         | Manual-only                   |
| Phone format              | Invalid phone          | —              | —                           | No         | Manual-only                   |
| Min/max length            | Text fields            | —              | —                           | No         | Manual-only                   |
| Cardlist inner fields     | Required/validation    | —              | —                           | No         | Manual-only                   |
| Previous→Next persistence | Licensing page         | —              | —                           | No         | N/A in QA (Previous disabled) |

## 26. Manual-Only / Gap Coverage

1. **TAPD IDs** — no export in repo; replace QA-REF when available
2. **Agent Address field validation** on Flow B/C Next
3. **Phone number format** invalid input
4. **Min/max length** for name and license fields
5. **Additional Agents cardlist** inner field rules
6. **Previous button data retention** — not testable (Previous disabled on Licensing)
7. **Per-state execution** — covered by resolver + 4 representatives only

## 27. Execution Results

**Run:** 2026-08-11 — `TAGS=@application-form and @term-life and @licensing`

| Metric          | Count |
| --------------- | ----: |
| Total scenarios |    11 |
| Passed          |    11 |
| Failed          |     0 |
| Skipped         |     0 |

All representative flow and behavior scenarios passed against QA (`agent-portal-qa-20.ilifeta.com`).

## 28. ESLint

Run: `npm run lint:eslint` — **PASS** (2026-08-11)

## 29. TypeScript

Run: `npm run lint:types` — **PASS** (2026-08-11)

## 30. Allure

Results: `src/reports/allure-results`  
Report: `src/reports/allure-report` (generate via `npm run allure:generate`)

Each scenario attaches **Resolved Licensing Flow** (State, Flow, Representative). Assertions use BaseAssertions Expected/Actual/Result recording.

---

## Architecture Traceability

```
Feature (application-form-licensing.feature)
  → Step definitions (licensing.steps.ts)
    → Page (LicensingPage.ts)
    → Assertions (LicensingAssertions.ts)
    → Resolver / test data (LicensingFlowResolver.ts, licensing.json)
    → Base (BaseActions, BaseAssertions)
    → Allure (ReportManager attachments)
```

## Files

| Action     | Path                                              |
| ---------- | ------------------------------------------------- |
| Feature    | `src/features/application-form-licensing.feature` |
| Steps      | `src/stepdefinitions/licensing.steps.ts`          |
| Page       | `src/pages/LicensingPage.ts`                      |
| Assertions | `src/assertions/LicensingAssertions.ts`           |
| Locators   | `src/locators/LicensingLocators.ts`               |
| Test data  | `src/testdata/licensing.json`                     |
| Resolver   | `src/utils/licensing/LicensingFlowResolver.ts`    |
| Report     | `docs/modules/term-life-licensing-automation.md`  |

**Login:** untouched  
**Application Creation:** preserved (reused via existing page methods only)
