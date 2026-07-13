import { Page } from 'playwright';
import { BasePage } from '../base/BasePage';
import { ROUTES } from '../constants';
import { LoginLocators } from '../locators/LoginLocators';

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Login page business actions only.
 * Locators are imported — never defined inline.
 */
export class LoginPage extends BasePage {
  private readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page, 'LoginPage');
    this.locators = new LoginLocators(page);
  }

  async openLoginPage(): Promise<void> {
    this.logger.info('Opening login page');
    await this.actions.navigateTo(ROUTES.login);
    await this.actions.waitForPageLoad();
  }

  async enterUsername(username: string): Promise<void> {
    await this.actions.fill(this.locators.usernameInput, username, 'Username');
  }

  async enterPassword(password: string): Promise<void> {
    await this.actions.fill(this.locators.passwordInput, password, 'Password');
  }

  async clickLoginButton(): Promise<void> {
    await this.actions.click(this.locators.loginButton, 'Login button');
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.logger.info(`Logging in as ${credentials.username}`);
    await this.enterUsername(credentials.username);
    await this.enterPassword(credentials.password);
    await this.clickLoginButton();
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    this.logger.info('Verifying login page is displayed');
    await this.assertions.verifyVisible(
      this.locators.loginButton,
      'Login button',
    );
  }

  async verifySuccessfulLogin(): Promise<void> {
    this.logger.info('Verifying successful login');
    await this.assertions.verifyURL(/inventory\.html/);
    await this.assertions.verifyVisible(
      this.locators.inventoryContainer,
      'Inventory container',
    );
  }

  async verifyLoginError(expectedMessage: string): Promise<void> {
    this.logger.info('Verifying login error message');
    await this.assertions.verifyVisible(
      this.locators.errorMessage,
      'Error message',
    );
    await this.assertions.verifyContains(
      this.locators.errorMessage,
      expectedMessage,
      'Error message',
    );
  }
}
