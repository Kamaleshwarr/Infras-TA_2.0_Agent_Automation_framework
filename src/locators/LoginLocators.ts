import { Page } from 'playwright';

/**
 * Login page locators only — no business logic.
 * Target: Transamerica Agent Portal (secure.transamerica.com selectors)
 */
export class LoginLocators {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.locator('#username');
  }

  get passwordInput() {
    return this.page.locator('#password');
  }

  get loginButton() {
    return this.page.locator('#formLogin');
  }

  get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  get loginPage() {
    return this.page.locator('[data-test="login-page"]');
  }

  get dashboardContainer() {
    return this.page.locator('[data-test="dashboard-container"]');
  }
}
