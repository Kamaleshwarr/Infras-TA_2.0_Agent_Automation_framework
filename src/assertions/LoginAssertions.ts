import { Locator, Page } from 'playwright';
import { BaseAssertions } from '../base/BaseAssertions';
import { dependencies } from '../core/DependencyRegistry';
import { AssertionReportContext, CucumberAttach, ILogger } from '../interfaces';
import { DashboardLocators } from '../locators/DashboardLocators';
import { LoginLocators } from '../locators/LoginLocators';
import { TestDataProvider } from '../testdata/providers/TestDataProvider';

export interface LoginMessages {
  invalidCredentials: string;
  emailRequired: string;
  passwordRequired: string;
  invalidEmailFormat: string;
}

export interface LoginPageMetadata {
  titlePattern: string;
  urlPath: string;
  heading: string;
}

export interface LoginValidationCase {
  caseId: string;
  email: string;
  password: string;
  emailErrorMessage?: keyof LoginMessages;
  passwordErrorMessage?: keyof LoginMessages;
  authErrorMessage?: keyof LoginMessages;
}

export interface LoginTestData {
  page: LoginPageMetadata;
  messages: LoginMessages;
  validationCases: LoginValidationCase[];
}

/**
 * Login-specific assertions — business validations only.
 */
export class LoginAssertions {
  private readonly logger: ILogger;
  private readonly assertions: BaseAssertions;
  private readonly locators: LoginLocators;
  private readonly dashboardLocators: DashboardLocators;
  private readonly testData: LoginTestData;

  constructor(page: Page, attach: CucumberAttach) {
    this.logger = dependencies.createLogger('LoginAssertions');
    this.assertions = new BaseAssertions(page, this.logger, { attach });
    this.locators = new LoginLocators(page);
    this.dashboardLocators = new DashboardLocators(page);
    this.testData = TestDataProvider.loadJson<LoginTestData>('login.json');
  }

  setReportContext(context: AssertionReportContext): void {
    this.assertions.setReportContext(context);
  }

  getValidationCase(caseId: string): LoginValidationCase {
    const validationCase = this.testData.validationCases.find(
      (entry) => entry.caseId === caseId,
    );

    if (!validationCase) {
      throw new Error(`Unknown login validation case: ${caseId}`);
    }

    return validationCase;
  }

  resolveMessage(messageKey: keyof LoginMessages): string {
    return this.testData.messages[messageKey];
  }

  async verifyLoginPageLoaded(): Promise<void> {
    this.logger.info('Verifying login page is loaded');

    await this.assertions.verifyTitle(
      new RegExp(this.escapeRegex(this.testData.page.titlePattern), 'i'),
    );
    await this.assertions.verifyURL(
      new RegExp(this.escapeRegex(this.testData.page.urlPath)),
    );
    await this.assertions.verifyContains(
      this.locators.pageHeading,
      this.testData.page.heading,
      'Login page heading',
    );
    await this.assertions.verifyVisible(
      this.locators.emailInput,
      'Email field',
    );
    await this.assertions.verifyVisible(
      this.locators.passwordInput,
      'Password field',
    );
    await this.assertions.verifyVisible(
      this.locators.signInButton,
      'Sign in button',
    );
    await this.assertions.verifyVisible(
      this.locators.forgotPasswordButton,
      'Forgot password button',
    );
  }

  async verifySuccessfulLogin(): Promise<void> {
    this.logger.info('Verifying successful login');
    await this.assertions.verifyVisible(
      this.dashboardLocators.createNewApplicationButton,
      'Create New Application button',
    );
  }

  async verifyInvalidCredentialsMessage(): Promise<void> {
    await this.verifyAuthenticationError('invalidCredentials');
  }

  async verifyEmailRequiredMessage(): Promise<void> {
    await this.verifyFieldError(
      this.locators.emailFieldError,
      'emailRequired',
      'Email field validation',
    );
  }

  async verifyPasswordRequiredMessage(): Promise<void> {
    await this.verifyFieldError(
      this.locators.passwordFieldError,
      'passwordRequired',
      'Password field validation',
    );
  }

  async verifyInvalidEmailFormatMessage(): Promise<void> {
    await this.verifyFieldError(
      this.locators.emailFieldError,
      'invalidEmailFormat',
      'Email format validation',
    );
  }

  async verifyValidationCase(caseId: string): Promise<void> {
    const validationCase = this.getValidationCase(caseId);

    if (validationCase.emailErrorMessage) {
      await this.verifyFieldError(
        this.locators.emailFieldError,
        validationCase.emailErrorMessage,
        `${caseId} email validation`,
      );
    }

    if (validationCase.passwordErrorMessage) {
      await this.verifyFieldError(
        this.locators.passwordFieldError,
        validationCase.passwordErrorMessage,
        `${caseId} password validation`,
      );
    }

    if (validationCase.authErrorMessage) {
      await this.verifyAuthenticationError(
        validationCase.authErrorMessage,
        caseId,
      );
    }
  }

  async verifyForgotPasswordDialog(): Promise<void> {
    this.logger.info('Verifying forgot password dialog is displayed');
    await this.assertions.verifyVisible(
      this.locators.forgotPasswordDialogHeading,
      'Forgot password dialog heading',
    );
    await this.assertions.verifyVisible(
      this.locators.forgotPasswordInstruction,
      'Forgot password instruction',
    );
    await this.assertions.verifyVisible(
      this.locators.forgotPasswordCancelButton,
      'Forgot password Cancel button',
    );
    await this.assertions.verifyVisible(
      this.locators.forgotPasswordSubmitButton,
      'Forgot password Submit button',
    );
    await this.assertions.verifyVisible(
      this.locators.forgotPasswordCloseButton,
      'Forgot password Close button',
    );
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await this.verifyLoginPageLoaded();
  }

  private async verifyFieldError(
    locator: Locator,
    messageKey: keyof LoginMessages,
    context: string,
  ): Promise<void> {
    const expected = this.resolveMessage(messageKey);
    await this.assertions.verifyContains(locator, expected, context);
  }

  private async verifyAuthenticationError(
    messageKey: keyof LoginMessages,
    context = 'Authentication failure',
  ): Promise<void> {
    const expected = this.resolveMessage(messageKey);
    await this.assertions.verifyContains(
      this.locators.authenticationErrorBanner,
      expected,
      context,
    );
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
