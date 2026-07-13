# Test Data

## Purpose

JSON-based test inputs separated from source code. No hardcoded credentials.

## Current Files

| File | Module |
|------|--------|
| `login.json` | Login credentials and error messages |

## Coding Standards

- One JSON file per module: `{module}.json`.
- Load via `TestDataLoader.load<T>('filename.json')`.
- Never commit real production credentials.
- Use descriptive keys: `validUser`, `invalidUser`, `errorMessages`.

## Example Structure

```json
{
  "validUser": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "invalidUser": {
    "username": "invalid_user",
    "password": "wrong_password"
  }
}
```

## Usage

```typescript
const loginData = TestDataLoader.load<LoginTestData>('login.json');
await this.loginPage.login(loginData.validUser);
```

## Related

- [src/stepdefinitions/README.md](../stepdefinitions/README.md)
