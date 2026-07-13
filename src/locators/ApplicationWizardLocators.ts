import { Page } from 'playwright';

/**
 * Application Wizard locators — page 1 (Licensing and Appointment).
 */
export class ApplicationWizardLocators {
  constructor(private readonly page: Page) {}

  get wizardPageOne() {
    return this.page.locator('[data-test="wizard-page-one"]');
  }

  get wizardStepIndicator() {
    return this.page.locator('[data-test="wizard-step-indicator"]');
  }

  get productTypeSelect() {
    return this.page.locator('[data-test="product-type"]');
  }

  get applicationStateSelect() {
    return this.page.locator('[data-test="application-state"]');
  }

  get agentNumberInput() {
    return this.page.locator('[data-test="agent-number"]');
  }

  get officeNumberInput() {
    return this.page.locator('[data-test="office-number"]');
  }

  get hasSecondAgentSelect() {
    return this.page.locator('[data-test="has-second-agent"]');
  }
}
