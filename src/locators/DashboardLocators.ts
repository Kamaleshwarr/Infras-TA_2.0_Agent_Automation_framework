import { Page } from 'playwright';

/**
 * Dashboard page locators only — navigation-focused, minimal scope.
 * Target: Transamerica Agent Portal dashboard.
 */
export class DashboardLocators {
  constructor(private readonly page: Page) {}

  get dashboardContainer() {
    return this.page.locator('[data-test="dashboard-container"]');
  }

  get createNewApplicationButton() {
    return this.page.locator('[data-test="create-new-application-button"]');
  }
}
