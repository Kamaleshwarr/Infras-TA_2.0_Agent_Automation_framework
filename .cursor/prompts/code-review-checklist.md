# Code Review Checklist

## Architecture

- [ ] Follows Page Object Model (locators → pages → steps)
- [ ] No Playwright code in step definitions
- [ ] No selectors in page classes
- [ ] No business logic in locator files

## Code Quality

- [ ] Strict TypeScript — no unjustified `any`
- [ ] Async/await only — no callbacks
- [ ] No `waitForTimeout()` or hard sleeps
- [ ] Meaningful method and variable names
- [ ] No duplicate code — uses base classes

## Testing

- [ ] Scenarios are independent
- [ ] Positive and negative paths covered
- [ ] Test data in JSON, not hardcoded
- [ ] Appropriate tags applied
- [ ] `npm run lint` passes
- [ ] `npm test` passes

## Performance

- [ ] No unnecessary page reloads
- [ ] Locator-based waits used
- [ ] Parallel-safe (no shared mutable state)

## Documentation

- [ ] Folder README created or updated
- [ ] `.env.example` updated if config changed
- [ ] `docs/` updated for user-facing changes
- [ ] `.cursor/rules/` updated if standards changed

## Reporting & Hooks

- [ ] Failure artifacts work (screenshot on failure)
- [ ] New pages registered in `CustomWorld`
- [ ] Logging present for key actions

## Security

- [ ] No credentials in source code
- [ ] No `.env` committed
- [ ] No secrets in logs

## Git

- [ ] Conventional commit message
- [ ] Focused PR scope
- [ ] No unrelated changes
