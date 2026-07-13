# Troubleshooting

See also [`.cursor/rules/troubleshooting.md`](../.cursor/rules/troubleshooting.md).

## Quick Fixes

| Problem | Solution |
|---------|----------|
| Browsers not found | `npx playwright install chromium` |
| Linux deps missing | `sudo npx playwright install-deps chromium` |
| Tests timeout | Increase `ACTION_TIMEOUT` in `.env` |
| Wrong URL | Check `ENV` and `BASE_URL` in `.env` |
| Headed not working | `npm run test:headed` |
| Empty Allure report | Run `npm run allure:generate` after tests |
| Parallel failures | Reduce `WORKERS` or check scenario isolation |
| TypeScript errors | Run `npm run lint` |

## Debug Workflow

1. Run headed: `npm run test:headed`
2. Run single tag: `npm run test:tags "@positive"`
3. Enable debug logs: `LOG_LEVEL=DEBUG npm test`
4. On failure, open Playwright trace at [trace.playwright.dev](https://trace.playwright.dev)

## Flaky Tests

- Ensure no `waitForTimeout()` in codebase.
- Use locator-based waits via `BaseActions`.
- Verify scenarios don't share state.
- Check for environment-specific timing issues.

## Getting Help

1. Check [FAQ](faq.md)
2. Review module README in the relevant `src/` folder
3. Inspect Allure report failure attachments
