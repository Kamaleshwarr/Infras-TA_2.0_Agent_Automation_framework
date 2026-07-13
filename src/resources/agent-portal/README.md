# Agent Portal Demo Application

## Purpose

Static HTML demo of the Transamerica Agent Portal business flow used for local and CI automation when `BASE_URL` targets this folder.

## Flow

```
login.html → dashboard.html → application-wizard.html
```

## Pages

| File                      | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| `login.html`              | Agent login (selectors aligned with secure.transamerica.com) |
| `dashboard.html`          | Minimal dashboard with Create New Application navigation     |
| `application-wizard.html` | Application Wizard page 1 — Licensing and Appointment        |

## Test Credentials

Configured in `src/testdata/login.json`:

- Username: `agent_user`
- Password: `agent_pass`

## Usage

Environment files point `BASE_URL` to `login.html` via `ApplicationConstants`. Override with a real portal URL for UAT/PROD execution:

```bash
BASE_URL=https://secure.transamerica.com npm test
```

## Standards

- Stable `data-test` attributes on business-critical elements
- Login form IDs match production (`#username`, `#password`, `#formLogin`)
- No server required — pages load via `file://` URLs
