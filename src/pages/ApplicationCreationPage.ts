import { Locator, Page } from 'playwright';
import { getEnvironmentConfig } from '../config/environment.config';
import { BasePage } from '../base/BasePage';
import { ApplicationCreationLocators } from '../locators/ApplicationCreationLocators';

export interface ApplicationCreationSelection {
  state: string;
  stateCode: string;
  product: string;
  productCode: string;
  template: string;
  templateCode: string;
  dashboardStatus: string;
}

/**
 * Application Creation dialog — business actions only.
 */
export class ApplicationCreationPage extends BasePage {
  private readonly locators: ApplicationCreationLocators;

  constructor(page: Page) {
    super(page, 'ApplicationCreationPage');
    this.locators = new ApplicationCreationLocators(page);
  }

  async openCreateApplicationDialog(): Promise<void> {
    this.logger.info('Opening Create New Application dialog');
    await this.actions.click(
      this.locators.createNewApplicationButton,
      'Create New Application button',
    );
    await this.actions.waitForVisible(
      this.locators.dialogHeading,
      'Create New Application dialog heading',
    );
  }

  async selectState(state: string, stateCode: string): Promise<void> {
    this.logger.info(`Selecting state: ${state}`);
    await this.actions.click(this.locators.stateTrigger, 'State trigger');
    await this.actions.click(
      this.locators.stateOption(stateCode),
      `State option ${state}`,
    );
    await this.waitForFieldEnabled(
      this.locators.productTrigger,
      'Product trigger',
    );
  }

  async selectProduct(product: string, productCode: string): Promise<void> {
    this.logger.info(`Selecting product: ${product}`);
    await this.actions.click(this.locators.productTrigger, 'Product trigger');
    await this.actions.click(
      this.locators.productOption(productCode),
      `Product option ${product}`,
    );
    await this.actions.waitForVisible(
      this.locators.templateTrigger,
      'Template trigger',
    );
  }

  async selectTemplate(template: string, templateCode: string): Promise<void> {
    this.logger.info(`Selecting template: ${template}`);
    await this.actions.click(this.locators.templateTrigger, 'Template trigger');
    await this.actions.click(
      this.locators.templateOption(templateCode),
      `Template option ${template}`,
    );
    await this.waitForFieldEnabled(
      this.locators.startApplicationButton,
      'Start Application button',
    );
  }

  async selectVerifiedState(
    selection: ApplicationCreationSelection,
  ): Promise<void> {
    await this.selectState(selection.state, selection.stateCode);
  }

  async selectVerifiedProduct(
    selection: ApplicationCreationSelection,
  ): Promise<void> {
    await this.selectProduct(selection.product, selection.productCode);
  }

  async selectVerifiedStateAndProduct(
    selection: ApplicationCreationSelection,
  ): Promise<void> {
    await this.selectVerifiedState(selection);
    await this.selectVerifiedProduct(selection);
  }

  async selectVerifiedApplicationCombination(
    selection: ApplicationCreationSelection,
  ): Promise<void> {
    await this.selectApplicationCombination(selection);
  }

  async selectApplicationCombination(
    selection: ApplicationCreationSelection,
  ): Promise<void> {
    await this.selectState(selection.state, selection.stateCode);
    await this.selectProduct(selection.product, selection.productCode);
    await this.selectTemplate(selection.template, selection.templateCode);
  }

  async openStateDropdown(): Promise<void> {
    this.logger.info('Opening State dropdown');
    await this.actions.click(this.locators.stateTrigger, 'State trigger');
  }

  async getAvailableStateOptions(): Promise<string[]> {
    this.logger.info('Reading available State dropdown options');
    const options = this.locators.stateDropdownOptions;
    const count = await options.count();
    const locations: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const location = ((await options.nth(index).textContent()) ?? '').trim();
      if (location) {
        locations.push(location);
      }
    }

    return locations;
  }

  async openProductDropdown(): Promise<void> {
    this.logger.info('Opening Product dropdown');
    await this.actions.click(this.locators.productTrigger, 'Product trigger');
  }

  async selectStateAndProduct(
    state: string,
    stateCode: string,
    product: string,
    productCode: string,
  ): Promise<void> {
    await this.selectState(state, stateCode);
    await this.selectProduct(product, productCode);
  }

  async returnToApplications(): Promise<void> {
    this.logger.info('Returning to Applications page');
    await this.actions.click(
      this.locators.returnToApplicationsLink,
      'Return to Applications link',
    );
    await this.actions.waitForVisible(
      this.locators.applicationsPageHeading,
      'Applications page heading',
    );
    await this.actions.waitForVisible(
      this.locators.createNewApplicationButton,
      'Create New Application button',
    );
  }

  async startApplication(): Promise<void> {
    this.logger.info('Starting application');
    await this.actions.click(
      this.locators.startApplicationButton,
      'Start Application button',
    );
    const navigationTimeout = getEnvironmentConfig().navigationTimeout;
    await this.page.waitForURL('**/application/new**', {
      timeout: navigationTimeout,
    });
    await this.actions.waitForVisibleWithTimeout(
      this.locators.applicationSectionsHeading,
      'Application Sections heading',
      navigationTimeout,
    );
    await this.actions.waitForVisibleWithTimeout(
      this.locators.returnToApplicationsLink,
      'Return to Applications link',
      navigationTimeout,
    );
    await this.actions.waitForPageLoad();
  }

  async cancelApplication(): Promise<void> {
    this.logger.info('Cancelling application creation');
    await this.actions.click(
      this.locators.cancelButton,
      'Cancel application creation button',
    );
  }

  async closeApplicationDialog(): Promise<void> {
    this.logger.info('Closing Create New Application dialog');
    await this.actions.click(
      this.locators.closeButton,
      'Close application creation dialog button',
    );
    await this.actions.waitForHidden(
      this.locators.dialogHeading,
      'Create New Application dialog heading',
    );
  }

  private async waitForFieldEnabled(
    locator: Locator,
    elementName: string,
  ): Promise<void> {
    this.logger.info(`Waiting for ${elementName} to become enabled`);
    const timeout = getEnvironmentConfig().actionTimeout;
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      if (await locator.isEnabled()) {
        return;
      }
      await this.page.waitForTimeout(200);
    }

    throw new Error(
      `${elementName} did not become enabled within ${timeout}ms`,
    );
  }
}
