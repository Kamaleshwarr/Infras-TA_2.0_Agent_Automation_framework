# Prompt: Create New Page

Use when adding a page object for an existing or new application screen.

## Steps

1. **Create locator file** — `src/locators/{Page}Locators.ts`
2. **Create page file** — `src/pages/{Page}Page.ts`
3. **Register in World** — `src/hooks/world.ts` → `initializePages()`
4. **Update README** — `src/locators/README.md` and `src/pages/README.md`

## Locator Template

```typescript
import { Page } from 'playwright';

export class DashboardLocators {
  constructor(private readonly page: Page) {}

  get welcomeMessage() {
    return this.page.locator('[data-test="welcome"]');
  }
}
```

## Page Template

```typescript
import { Page } from 'playwright';
import { BasePage } from '../base/BasePage';
import { DashboardLocators } from '../locators/DashboardLocators';

export class DashboardPage extends BasePage {
  private readonly locators: DashboardLocators;

  constructor(page: Page) {
    super(page, 'DashboardPage');
    this.locators = new DashboardLocators(page);
  }

  async verifyDashboardDisplayed(): Promise<void> {
    await this.assertions.verifyVisible(
      this.locators.welcomeMessage,
      'Welcome message',
    );
  }
}
```

## Rules

- No selectors in page class.
- No Playwright imports in step definitions.
- All actions through `this.actions`, all verifications through `this.assertions`.
