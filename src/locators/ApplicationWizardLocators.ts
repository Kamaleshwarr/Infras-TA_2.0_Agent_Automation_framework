import { Page } from 'playwright';

/**
 * Application Wizard locators — page 1 (Licensing and Appointment).
 * Target: Transamerica iGO e-App wizard entry screen.
 */
export class ApplicationWizardLocators {
  constructor(private readonly page: Page) {}

  get wizardPageOneHeading() {
    return this.page.getByText(/licensing and appointment/i);
  }

  get productTypeSelect() {
    return this.page.getByLabel(/product type/i);
  }

  get applicationStateSelect() {
    return this.page.getByLabel(/application state|state/i);
  }

  get agentNumberInput() {
    return this.page.getByLabel(/agent\s*#/i);
  }

  get officeNumberInput() {
    return this.page.getByLabel(/office\s*#/i);
  }

  get hasSecondAgentSelect() {
    return this.page.getByLabel(/second agent/i);
  }
}
