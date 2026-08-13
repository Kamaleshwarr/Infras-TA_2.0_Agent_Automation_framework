# Term Life — Licensing Module Exploration

> Discovery-only report. No Application Form automation implemented.
> Generated: 2026-08-11T13:21:49.077Z (updated 2026-08-11 — Hawaii & Rhode Island manual QA classification)
> Source states: `src/testdata/application-creation.json` (52 locations)

## 1. Module Name

**Licensing**

## 2. Purpose

Captures agent licensing information at the start of the Term Life application form, including writing agent identity, contact details, office ID, agent percent split, and optional additional-agent declaration.

## 3. States Examined

| Metric                                  |  Count |
| --------------------------------------- | -----: |
| Catalog locations                       |     52 |
| Licensing module explored (automated)   |     48 |
| Licensing module classified (manual QA) |      2 |
| **Total Licensing coverage**            | **50** |
| Term Life unavailable                   |      2 |
| Blocked / failed                        |      0 |

Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, District of Columbia, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## 4. States Where Term Life Is Unavailable

- **Guam** (gu)
- **Puerto Rico** (pr)

## 5. Complete Licensing Field / Question Inventory

Representative inventory from **Alabama** (first explored state in representative flow group):

| Label                     | Field ID | Type        | Required | Default | Disabled | Input testId                                        |
| ------------------------- | -------- | ----------- | -------- | ------- | -------- | --------------------------------------------------- |
| Writing Agent First Name* | 40127    | text        | Yes      | —       | No       | `agp-form-field-text-40127-input`                   |
| Writing Agent Last Name*  | 40128    | text        | Yes      | —       | No       | `agp-form-field-text-40128-input`                   |
| Agent Number              | 40129    | text        | No       | —       | No       | `agp-form-field-text-40129-input`                   |
| Office Id*                | 41053    | text        | Yes      | —       | No       | `agp-form-field-text-41053-input`                   |
| Agent Profile i           | 41052    | text        | No       | 001     | Yes      | `agp-form-field-text-41052-input`                   |
| Agent Email*              | 41018    | email       | Yes      | —       | No       | `agp-form-field-email-41018-input`                  |
| Phone Number*             | 40130    | phonenumber | Yes      | —       | No       | `agp-form-field-phonenumber-40130-input`            |
| Agent Percent*            | 41084    | number      | Yes      | 100     | Yes      | `agp-form-field-number-41084-input`                 |
| Any Additional Agents?*   | 41021    | radioswitch | Yes      | Yes     | No       | `agp-form-field-radioswitch-41021-option-yes-input` |

## 6. Field Types

- `email`
- `number`
- `phonenumber`
- `radioswitch`
- `text`

## 7. Required / Optional Behavior

**Required fields**

- Writing Agent First Name* (`text:40127`)
- Writing Agent Last Name* (`text:40128`)
- Office Id* (`text:41053`)
- Agent Email* (`email:41018`)
- Phone Number* (`phonenumber:40130`)
- Agent Percent* (`number:41084`)
- Any Additional Agents?* (`radioswitch:41021`)

**Optional fields**

- Agent Number (`text:40129`)
- Agent Profile i (`text:41052`)

## 8. Dropdown / Radio / Checkbox Options

### agp-form-field-radioswitch-41021

- Any Additional Agents?* Yes No — `agp-form-field-radioswitch-41021`
- Yes — `agp-form-field-radioswitch-41021-option-yes`
- No — `agp-form-field-radioswitch-41021-option-no`

## 9. Validation Rules

- **Writing Agent First Name***: Please fill the required field
- **Writing Agent Last Name***: Please fill the required field
- **Office Id***: Please fill the required field
- **Agent Email***: Please fill the required field
- **Phone Number***: Please fill the required field
- **Any Additional Agents?***: Please fill the required field

Incomplete counter after empty Next: **1/6**

## 10. Conditional Logic

- Trigger: `agp-form-field-radioswitch-41021-option-yes` (Yes)
  - Appeared: cardlist:41022

## 11. State-Specific Differences

### Manual QA classification — Hawaii & Rhode Island

Both states failed automated discovery only at **Application Creation** (dialog timeout). Manual QA confirmed Term Life and the Licensing module work in QA. Neither state introduces a new Licensing flow.

| State        | Flow A (standard)                                                        | Flow B (address + license) | Flow C (address only) | Flow D (license only) | **Assigned**         |
| ------------ | ------------------------------------------------------------------------ | -------------------------- | --------------------- | --------------------- | -------------------- |
| Hawaii       | ✅ Matches — Agent Information only; no License Number; no Agent Address | ❌                         | ❌                    | ❌                    | **Licensing-Flow-A** |
| Rhode Island | ✅ Matches — same as neighboring New England states (CT, MA, ME, NH, VT) | ❌                         | ❌                    | ❌                    | **Licensing-Flow-A** |

No new flow group (E) required.

### Licensing-Flow-A — Alabama

States: Alabama, Alaska, Arizona, Arkansas, Colorado, Connecticut, District of Columbia, **Hawaii**, Idaho, Illinois, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Mississippi, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, North Carolina, North Dakota, Ohio, Oregon, **Rhode Island**, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, West Virginia, Wisconsin

**Flow A profile:** Agent Information only — 9 core fields, no License Number (`45242`), no Agent Address subsection, incomplete counter `1/6`, standard validation and conditional behavior (Any Additional Agents? → `cardlist:41022`).

**Manual QA additions:** Hawaii and Rhode Island were blocked during automated discovery (Create Application dialog timeout — not a product or Licensing-flow difference). Manual QA confirmed both states reach Term Life Licensing successfully and exhibit **Flow A** behavior (standard Agent Information; no License Number; no Agent Address subsection).

```json
{
  "headings": ["Agent Information", "Term Life"],
  "fields": [
    "email:41018:R:agent email",
    "number:41084:R:D:agent percent",
    "phonenumber:40130:R:phone number",
    "radioswitch:41021:R:any additional agents?",
    "text:40127:R:writing agent first name",
    "text:40128:R:writing agent last name",
    "text:40129:O:agent number",
    "text:41052:O:D:agent profile i",
    "text:41053:R:office id"
  ],
  "dropdownOptions": {},
  "optionGroups": [
    {
      "groupTestId": "agp-form-field-radioswitch-41021",
      "options": ["Any Additional Agents?*\nYes\nNo:U", "No:U", "Yes:U"]
    }
  ],
  "checkboxes": [],
  "validationErrors": [
    "40127:Please fill the required field",
    "40128:Please fill the required field",
    "40130:Please fill the required field",
    "41018:Please fill the required field",
    "41021:Please fill the required field",
    "41053:Please fill the required field"
  ],
  "conditionalProbes": [
    "agp-form-field-radioswitch-41021-option-yes:cardlist:41022:"
  ],
  "navigation": {
    "nextDisabled": [false, false],
    "previousDisabled": [true],
    "incompleteCounter": "1/6"
  }
}
```

### Licensing-Flow-B — California

States: California, Florida, Georgia, Indiana, Wyoming

```json
{
  "headings": ["Agent Information", "Agent Address", "Term Life"],
  "fields": [
    "email:41018:R:agent email",
    "number:41084:R:D:agent percent",
    "phonenumber:40130:R:phone number",
    "radioswitch:41021:R:any additional agents?",
    "text:40127:R:writing agent first name",
    "text:40128:R:writing agent last name",
    "text:40129:O:agent number",
    "text:41052:O:D:agent profile i",
    "text:41053:R:office id",
    "text:45242:R:license number"
  ],
  "dropdownOptions": {},
  "optionGroups": [
    {
      "groupTestId": "agp-form-field-radioswitch-41021",
      "options": ["Any Additional Agents?*\nYes\nNo:U", "No:U", "Yes:U"]
    }
  ],
  "checkboxes": [],
  "validationErrors": [
    "40127:Please fill the required field",
    "40128:Please fill the required field",
    "40130:Please fill the required field",
    "41018:Please fill the required field",
    "41021:Please fill the required field",
    "41053:Please fill the required field",
    "45242:License Number is required."
  ],
  "conditionalProbes": [
    "agp-form-field-radioswitch-41021-option-yes:cardlist:41022:"
  ],
  "navigation": {
    "nextDisabled": [false, false],
    "previousDisabled": [true],
    "incompleteCounter": "1/12"
  }
}
```

### Licensing-Flow-C — Delaware

States: Delaware, Michigan, Minnesota, Pennsylvania, Washington

```json
{
  "headings": ["Agent Information", "Agent Address", "Term Life"],
  "fields": [
    "email:41018:R:agent email",
    "number:41084:R:D:agent percent",
    "phonenumber:40130:R:phone number",
    "radioswitch:41021:R:any additional agents?",
    "text:40127:R:writing agent first name",
    "text:40128:R:writing agent last name",
    "text:40129:O:agent number",
    "text:41052:O:D:agent profile i",
    "text:41053:R:office id"
  ],
  "dropdownOptions": {},
  "optionGroups": [
    {
      "groupTestId": "agp-form-field-radioswitch-41021",
      "options": ["Any Additional Agents?*\nYes\nNo:U", "No:U", "Yes:U"]
    }
  ],
  "checkboxes": [],
  "validationErrors": [
    "40127:Please fill the required field",
    "40128:Please fill the required field",
    "40130:Please fill the required field",
    "41018:Please fill the required field",
    "41021:Please fill the required field",
    "41053:Please fill the required field"
  ],
  "conditionalProbes": [
    "agp-form-field-radioswitch-41021-option-yes:cardlist:41022:"
  ],
  "navigation": {
    "nextDisabled": [false, false],
    "previousDisabled": [true],
    "incompleteCounter": "1/11"
  }
}
```

### Licensing-Flow-D — Missouri

States: Missouri, Oklahoma

```json
{
  "headings": ["Agent Information", "Term Life"],
  "fields": [
    "email:41018:R:agent email",
    "number:41084:R:D:agent percent",
    "phonenumber:40130:R:phone number",
    "radioswitch:41021:R:any additional agents?",
    "text:40127:R:writing agent first name",
    "text:40128:R:writing agent last name",
    "text:40129:O:agent number",
    "text:41052:O:D:agent profile i",
    "text:41053:R:office id",
    "text:45242:R:license number"
  ],
  "dropdownOptions": {},
  "optionGroups": [
    {
      "groupTestId": "agp-form-field-radioswitch-41021",
      "options": ["Any Additional Agents?*\nYes\nNo:U", "No:U", "Yes:U"]
    }
  ],
  "checkboxes": [],
  "validationErrors": [
    "40127:Please fill the required field",
    "40128:Please fill the required field",
    "40130:Please fill the required field",
    "41018:Please fill the required field",
    "41021:Please fill the required field",
    "41053:Please fill the required field",
    "45242:License Number is required."
  ],
  "conditionalProbes": [
    "agp-form-field-radioswitch-41021-option-yes:cardlist:41022:"
  ],
  "navigation": {
    "nextDisabled": [false, false],
    "previousDisabled": [true],
    "incompleteCounter": "1/7"
  }
}
```

## 12. Stable Selectors Discovered

| Element                | Selector                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Application form page  | `[data-testid="agp-form-page"]`                                                                                         |
| Section nav list       | `[data-testid="agp-section-list"]`                                                                                      |
| Licensing section link | `[data-testid="agp-section-list"]` + link text **Licensing** (numeric suffix varies, e.g. `agp-section-item-5376-link`) |
| Form field pattern     | `[data-testid="agp-form-field-{type}-{id}"]`                                                                            |
| Field input pattern    | `[data-testid="agp-form-field-{type}-{id}-input"]`                                                                      |
| Field label pattern    | `[data-testid="agp-form-field-{type}-{id}-label"]`                                                                      |
| Primary Next           | `[data-testid="agp-form-action-1"]`                                                                                     |
| Incomplete Next        | `[data-testid="agp-form-incomplete-button-next"]`                                                                       |
| Previous               | `[data-testid="agp-form-incomplete-button-prev"]`                                                                       |
| Return to Applications | `[data-testid="agp-form-button-back"]`                                                                                  |
| Incomplete counter     | `[data-testid="agp-form-incomplete-counter"]`                                                                           |

## 13. Licensing Flow Groups

**4 unique Licensing flow group(s)** discovered.

## 14. States Belonging to Each Group

### Licensing-Flow-A

Alabama, Alaska, Arizona, Arkansas, Colorado, Connecticut, District of Columbia, Hawaii, Idaho, Illinois, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Mississippi, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, North Carolina, North Dakota, Ohio, Oregon, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, West Virginia, Wisconsin

### Licensing-Flow-B

California, Florida, Georgia, Indiana, Wyoming

### Licensing-Flow-C

Delaware, Michigan, Minnesota, Pennsylvania, Washington

### Licensing-Flow-D

Missouri, Oklahoma

## 15. Representative State for Each Group

- **Licensing-Flow-A**: Alabama
- **Licensing-Flow-B**: California
- **Licensing-Flow-C**: Delaware
- **Licensing-Flow-D**: Missouri

## 16. Recommended Minimum Automated State Coverage

Run full Licensing regression once per flow group using the representative state:

- **Licensing-Flow-A** → Alabama (covers 38 state(s))
- **Licensing-Flow-B** → California (covers 5 state(s))
- **Licensing-Flow-C** → Delaware (covers 5 state(s))
- **Licensing-Flow-D** → Missouri (covers 2 state(s))

## 17. States Requiring Dedicated Scenarios

- Alabama
- California
- Delaware
- Missouri

## 18. Blocked / Unexplored States

None. All 50 Term Life–applicable locations have Licensing coverage (48 automated + 2 manual QA).

**Previously blocked (automation only — not a flow difference):**

| State        | Automated result                  | Manual QA result                        | Assigned flow        |
| ------------ | --------------------------------- | --------------------------------------- | -------------------- |
| Hawaii       | Create Application dialog timeout | Term Life + Licensing confirmed working | **Licensing-Flow-A** |
| Rhode Island | Create Application dialog timeout | Term Life + Licensing confirmed working | **Licensing-Flow-A** |

## 19. Observations Requiring Manual Confirmation

- **Section link testId numeric suffix** (e.g. `5376`) may be environment-specific; prefer link text **Licensing** for navigation until confirmed stable across builds.
- **Agent Profile** field is pre-populated (`001`) and disabled — confirm whether automation should assert read-only behavior.
- **Agent Percent** defaults to `100` and is disabled — confirm split-agent scenarios are out of scope for Licensing.
- **Any Additional Agents?** selecting **Yes** reveals additional agent card list field (`cardlist:41022`) — confirm full card-list fields and save behavior manually.
- Validation messages render on empty **Next** as `Please fill the required field` (and `License Number is required.` where applicable).
- **Agent Address** subsection (Flow B/C) shows address fields in page text (`Country`, `Address Line 1`, `City`, `U.S. State/Territory`, `Zip Code`) but those inputs were not always present in the automated field-root scan — manual confirmation of address field IDs/selectors is recommended before automation.
- **Hawaii** and **Rhode Island** were manually verified in QA as **Licensing-Flow-A** (standard Agent Information). The prior automated timeout at Application Creation must not be treated as a Licensing-flow or Term Life availability difference.

---

## State Comparison Matrix

| State                | Product   | Flow Group       | Licensing Section testId                | Field Count | Variations                | Representative? |
| -------------------- | --------- | ---------------- | --------------------------------------- | ----------: | ------------------------- | --------------- |
| Alabama              | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | Yes             |
| Alaska               | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Arizona              | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Arkansas             | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| California           | Term Life | Licensing-Flow-B | `agp-section-item-5376-link`            |          10 | See group fingerprint     | Yes             |
| Colorado             | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Connecticut          | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Delaware             | Term Life | Licensing-Flow-C | `agp-section-item-5376-link`            |           9 | See group fingerprint     | Yes             |
| District of Columbia | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Florida              | Term Life | Licensing-Flow-B | `agp-section-item-5376-link`            |          10 | See group fingerprint     | No              |
| Georgia              | Term Life | Licensing-Flow-B | `agp-section-item-5376-link`            |          10 | See group fingerprint     | No              |
| Guam                 | Term Life | —                | `—`                                     |           — | term_life_unavailable     | No              |
| Hawaii               | Term Life | Licensing-Flow-A | `agp-section-item-5376-link` (expected) |           9 | None (manual QA = Flow A) | No              |
| Idaho                | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Illinois             | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Indiana              | Term Life | Licensing-Flow-B | `agp-section-item-5376-link`            |          10 | See group fingerprint     | No              |
| Iowa                 | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Kansas               | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Kentucky             | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Louisiana            | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Maine                | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Maryland             | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Massachusetts        | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Michigan             | Term Life | Licensing-Flow-C | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Minnesota            | Term Life | Licensing-Flow-C | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Mississippi          | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Missouri             | Term Life | Licensing-Flow-D | `agp-section-item-5376-link`            |          10 | See group fingerprint     | Yes             |
| Montana              | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Nebraska             | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Nevada               | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| New Hampshire        | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| New Jersey           | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| New Mexico           | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| North Carolina       | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| North Dakota         | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Ohio                 | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Oklahoma             | Term Life | Licensing-Flow-D | `agp-section-item-5376-link`            |          10 | See group fingerprint     | No              |
| Oregon               | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Pennsylvania         | Term Life | Licensing-Flow-C | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Puerto Rico          | Term Life | —                | `—`                                     |           — | term_life_unavailable     | No              |
| Rhode Island         | Term Life | Licensing-Flow-A | `agp-section-item-5376-link` (expected) |           9 | None (manual QA = Flow A) | No              |
| South Carolina       | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| South Dakota         | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Tennessee            | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Texas                | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Utah                 | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Vermont              | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Virginia             | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Washington           | Term Life | Licensing-Flow-C | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| West Virginia        | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Wisconsin            | Term Life | Licensing-Flow-A | `agp-section-item-5376-link`            |           9 | See group fingerprint     | No              |
| Wyoming              | Term Life | Licensing-Flow-B | `agp-section-item-5376-link`            |          10 | See group fingerprint     | No              |
