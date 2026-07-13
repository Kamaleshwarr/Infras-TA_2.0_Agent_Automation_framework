import { Page } from 'playwright';

/**
 * Login page locators only — no business logic.
 * Demo target: Sauce Demo (https://www.saucedemo.com)
 */
export class LoginLocators {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.locator('#user-name');
  }

  get passwordInput() {
    return this.page.locator('#password');
  }

  get loginButton() {
    return this.page.locator('#login-button');
  }

  get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  get inventoryContainer() {
    return this.page.locator('#inventory_container');
  }

  get pageTitle() {
    return this.page.locator('.title');
  }
}
