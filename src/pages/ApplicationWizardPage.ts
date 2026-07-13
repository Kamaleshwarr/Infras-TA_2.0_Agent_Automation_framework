import { Page } from 'playwright';
import { BasePage } from '../base/BasePage';
import { ApplicationWizardLocators } from '../locators/ApplicationWizardLocators';

export interface WizardPageOneData {
  productType: string;
  applicationState: string;
  agentNumber: string;
  officeNumber: string;
  hasSecondAgent: string;
}

export interface WizardPageOneDefaults {
  agentNumber: string;
  officeNumber: string;
}

/**
 * Application Wizard — business actions for wizard page 1.
 */
export class ApplicationWizardPage extends BasePage {
  private readonly locators: ApplicationWizardLocators;

  constructor(page: Page) {
    super(page, 'ApplicationWizardPage');
    this.locators = new ApplicationWizardLocators(page);
  }

  async verifyWizardPageOneDisplayed(): Promise<void> {
    this.logger.info('Verifying Application Wizard page 1 is displayed');
    await this.assertions.verifyURL(/application-wizard\.html/);
    await this.assertions.verifyVisible(
      this.locators.wizardPageOne,
      'Application Wizard page one',
    );
    await this.assertions.verifyVisible(
      this.locators.wizardStepIndicator,
      'Wizard step indicator',
    );
  }

  async verifyWizardStepIndicator(expectedText: string): Promise<void> {
    this.logger.info('Verifying wizard step indicator text');
    await this.assertions.verifyContains(
      this.locators.wizardStepIndicator,
      expectedText,
      'Wizard step indicator',
    );
  }

  async fillWizardPageOne(data: WizardPageOneData): Promise<void> {
    this.logger.info('Filling Application Wizard page 1');
    await this.actions.selectDropdown(
      this.locators.productTypeSelect,
      data.productType,
      'Product type',
    );
    await this.actions.selectDropdown(
      this.locators.applicationStateSelect,
      data.applicationState,
      'Application state',
    );
    await this.actions.fill(
      this.locators.agentNumberInput,
      data.agentNumber,
      'Agent number',
    );
    await this.actions.fill(
      this.locators.officeNumberInput,
      data.officeNumber,
      'Office number',
    );
    await this.actions.selectDropdown(
      this.locators.hasSecondAgentSelect,
      data.hasSecondAgent,
      'Second agent indicator',
    );
  }

  async verifyWizardPageOnePrefilledValues(
    defaults: WizardPageOneDefaults,
  ): Promise<void> {
    this.logger.info('Verifying Application Wizard page 1 prefilled values');
    await this.assertions.verifyAttribute(
      this.locators.agentNumberInput,
      'value',
      defaults.agentNumber,
      'Agent number',
    );
    await this.assertions.verifyAttribute(
      this.locators.officeNumberInput,
      'value',
      defaults.officeNumber,
      'Office number',
    );
  }
}
