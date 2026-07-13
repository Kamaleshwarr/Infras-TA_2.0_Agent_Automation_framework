import { Page } from 'playwright';

/**
 * Dashboard page locators only — navigation-focused, minimal scope.
 * Target: Transamerica Agent Portal Agent Home dashboard.
 */
export class DashboardLocators {
  constructor(private readonly page: Page) {}

  get createNewApplicationButton() {
    return this.page.getByRole('button', { name: /create new application/i });
  }
}
