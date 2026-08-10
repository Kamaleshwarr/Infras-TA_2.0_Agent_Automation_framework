import { Page } from 'playwright';
import { BasePage } from '../base/BasePage';
import { LoginLocators } from '../locators/LoginLocators';

export interface LoginCredentials {
  email: string;
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
    await this.actions.navigateTo('');
    await this.actions.waitForPageLoad();
    await this.actions.waitForVisible(this.locators.emailInput, 'Email field');
    await this.dismissBrowserCompatibilityNotice();
  }

  async enterEmail(email: string): Promise<void> {
    await this.actions.fill(this.locators.emailInput, email, 'Email');
  }

  async enterPassword(password: string): Promise<void> {
    await this.actions.fill(this.locators.passwordInput, password, 'Password');
  }

  async clearEmail(): Promise<void> {
    await this.actions.clear(this.locators.emailInput, 'Email');
  }

  async clearPassword(): Promise<void> {
    await this.actions.clear(this.locators.passwordInput, 'Password');
  }

  async clickSignIn(): Promise<void> {
    await this.actions.click(this.locators.signInButton, 'Sign in button');
  }

  async submitLogin(): Promise<void> {
    await this.clickSignIn();
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.logger.info(`Logging in as ${credentials.email}`);
    await this.enterEmail(credentials.email);
    await this.enterPassword(credentials.password);
    await this.submitLogin();
  }

  async loginWith(email: string, password: string): Promise<void> {
    await this.login({ email, password });
  }

  async navigateToForgotPassword(): Promise<void> {
    this.logger.info('Opening forgot password dialog');
    await this.actions.click(
      this.locators.forgotPasswordButton,
      'Forgot password button',
    );
  }

  async closeForgotPasswordWithCancel(): Promise<void> {
    await this.actions.click(
      this.locators.forgotPasswordCancelButton,
      'Forgot password Cancel button',
    );
  }

  async closeForgotPasswordWithClose(): Promise<void> {
    await this.actions.click(
      this.locators.forgotPasswordCloseButton,
      'Forgot password Close button',
    );
  }

  async isLoginPageLoaded(): Promise<boolean> {
    return (
      (await this.actions.isVisible(this.locators.emailInput, 'Email field')) &&
      (await this.actions.isVisible(
        this.locators.passwordInput,
        'Password field',
      )) &&
      (await this.actions.isVisible(
        this.locators.signInButton,
        'Sign in button',
      ))
    );
  }

  private async dismissBrowserCompatibilityNotice(): Promise<void> {
    const dismissButton = this.locators.browserCompatibilityDismissButton;
    if (await dismissButton.isVisible()) {
      await this.actions.click(
        dismissButton,
        'Browser compatibility notice dismiss',
      );
    }
  }
}
