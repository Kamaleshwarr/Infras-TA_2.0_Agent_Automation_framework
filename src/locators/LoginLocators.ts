import { Page } from 'playwright';

/**
 * Login page locators only — no business logic.
 * Target: Transamerica Agent Portal QA SPA (agent-portal-qa-20.ilifeta.com)
 */
export class LoginLocators {
  constructor(private readonly page: Page) {}

  get pageHeading() {
    return this.page.getByRole('heading', {
      name: /login to transamerica agent portal/i,
    });
  }

  get emailInput() {
    return this.page.locator('#field-email');
  }

  get passwordInput() {
    return this.page.locator('#field-password');
  }

  get signInButton() {
    return this.page.getByRole('button', { name: /sign in/i });
  }

  get forgotPasswordButton() {
    return this.page.getByRole('button', { name: /forgot password/i });
  }

  get emailFieldError() {
    return this.page.locator('#field-email-error');
  }

  get passwordFieldError() {
    return this.page.locator('#field-password-error');
  }

  get authenticationErrorBanner() {
    return this.page
      .locator('[role="alert"]')
      .filter({ hasText: /^Invalid credentials$/i });
  }

  get browserCompatibilityDismissButton() {
    return this.page.getByRole('button', { name: /ignore/i });
  }

  get forgotPasswordDialogHeading() {
    return this.page.getByRole('heading', { name: /^Forgot password$/i });
  }

  get forgotPasswordInstruction() {
    return this.page.getByText(
      /enter your email address and we will send you a link to reset your password/i,
    );
  }

  get forgotPasswordEmailInput() {
    return this.page
      .locator('form')
      .filter({ has: this.forgotPasswordDialogHeading })
      .locator('#field-email');
  }

  get forgotPasswordCancelButton() {
    return this.page.getByRole('button', { name: /^Cancel$/i });
  }

  get forgotPasswordSubmitButton() {
    return this.page.getByRole('button', { name: /^Submit$/i });
  }

  get forgotPasswordCloseButton() {
    return this.page.getByRole('button', { name: /^Close$/i });
  }
}
