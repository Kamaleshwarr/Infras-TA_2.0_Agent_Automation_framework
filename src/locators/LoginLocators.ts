import { Page } from 'playwright';

/**
 * Login page locators only — no business logic.
 * Target: Transamerica Agent Portal (https://secure.transamerica.com)
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
    return this.page.locator('#error-list');
  }
}
