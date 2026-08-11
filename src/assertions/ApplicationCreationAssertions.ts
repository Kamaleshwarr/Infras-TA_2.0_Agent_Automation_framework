import { Page } from 'playwright';
import { BaseAssertions } from '../base/BaseAssertions';
import { getEnvironmentConfig } from '../config/environment.config';
import { dependencies } from '../core/DependencyRegistry';
import { AssertionReportContext, CucumberAttach, ILogger } from '../interfaces';
import { ApplicationCreationLocators } from '../locators/ApplicationCreationLocators';
import { ApplicationCreationSelection } from '../pages/ApplicationCreationPage';
import { TestDataProvider } from '../testdata/providers/TestDataProvider';

export interface ApplicationCreationPageMetadata {
  dashboardUrlPath: string;
  applicationFormUrlPath: string;
  dialogHeading: string;
  applicationSectionsHeading: string;
  returnToApplicationsText: string;
}

export interface ApplicationCreationLocation {
  state: string;
  stateCode: string;
}

export interface ApplicationCreationIulData {
  regularState: ApplicationCreationLocation;
  puertoRico: ApplicationCreationLocation;
  guam: ApplicationCreationLocation;
  product: string;
  productCode: string;
  template: string;
  templateCode: string;
  dashboardStatus: string;
}

export interface ApplicationCreationAvailabilityData {
  iulOnlyLocations: string[];
  excludedStates: ApplicationCreationLocation[];
}

export interface ApplicationCreationStateDropdownData {
  expectedCount: number;
  expectedLocations: string[];
}

export interface ApplicationCreationTestData {
  page: ApplicationCreationPageMetadata;
  validApplication: ApplicationCreationSelection;
  termLife: ApplicationCreationSelection;
  iul: ApplicationCreationIulData;
  availability: ApplicationCreationAvailabilityData;
  stateDropdown: ApplicationCreationStateDropdownData;
}

/**
 * Application Creation assertions — business validations only.
 */
export class ApplicationCreationAssertions {
  private readonly logger: ILogger;
  private readonly page: Page;
  private readonly assertions: BaseAssertions;
  private readonly locators: ApplicationCreationLocators;
  private readonly testData: ApplicationCreationTestData;

  constructor(page: Page, attach: CucumberAttach) {
    this.page = page;
    this.logger = dependencies.createLogger('ApplicationCreationAssertions');
    this.assertions = new BaseAssertions(page, this.logger, { attach });
    this.locators = new ApplicationCreationLocators(page);
    this.testData = TestDataProvider.loadJson<ApplicationCreationTestData>(
      'application-creation.json',
    );
  }

  setReportContext(context: AssertionReportContext): void {
    this.assertions.setReportContext(context);
  }

  getValidApplication(): ApplicationCreationSelection {
    return this.testData.validApplication;
  }

  getIulApplicationSelection(
    location: keyof Pick<
      ApplicationCreationIulData,
      'regularState' | 'puertoRico' | 'guam'
    >,
  ): ApplicationCreationSelection {
    const locationData = this.testData.iul[location];

    return {
      state: locationData.state,
      stateCode: locationData.stateCode,
      product: this.testData.iul.product,
      productCode: this.testData.iul.productCode,
      template: this.testData.iul.template,
      templateCode: this.testData.iul.templateCode,
      dashboardStatus: this.testData.iul.dashboardStatus,
    };
  }

  getPuertoRicoIulApplication(): ApplicationCreationSelection {
    return this.getIulApplicationSelection('puertoRico');
  }

  getGuamIulApplication(): ApplicationCreationSelection {
    return this.getIulApplicationSelection('guam');
  }

  getAlabamaIulApplication(): ApplicationCreationSelection {
    return this.getIulApplicationSelection('regularState');
  }

  async verifyCreateNewApplicationButtonVisibleAndEnabled(): Promise<void> {
    this.logger.info(
      'Verifying Create New Application button is visible and enabled',
    );
    await this.assertions.verifyVisible(
      this.locators.createNewApplicationButton,
      'Create New Application button',
    );
    await this.assertions.verifyEnabled(
      this.locators.createNewApplicationButton,
      'Create New Application button',
    );
  }

  async verifyCreationDialogVisible(): Promise<void> {
    this.logger.info('Verifying Create New Application dialog is displayed');
    await this.assertions.verifyVisible(
      this.locators.dialogHeading,
      'Create New Application dialog heading',
    );
    await this.assertions.verifyContains(
      this.locators.dialogHeading,
      this.testData.page.dialogHeading,
      'Create New Application dialog heading text',
    );
  }

  async verifyCreationDialogClosed(): Promise<void> {
    this.logger.info('Verifying Create New Application dialog is closed');
    await this.assertions.verifyHidden(
      this.locators.dialogHeading,
      'Create New Application dialog heading',
    );
  }

  async verifyProductDisabledBeforeStateSelection(): Promise<void> {
    this.logger.info(
      'Verifying Product field is disabled before state selection',
    );
    await this.assertions.verifyDisabled(
      this.locators.productTrigger,
      'Product trigger',
    );
  }

  async verifyTemplateHiddenBeforeProductSelection(): Promise<void> {
    this.logger.info(
      'Verifying Template field is hidden before product selection',
    );
    await this.assertions.verifyHidden(
      this.locators.templateTrigger,
      'Template trigger',
    );
  }

  async verifyProductEnabledAfterStateSelection(): Promise<void> {
    this.logger.info(
      'Verifying Product field is enabled after state selection',
    );
    await this.assertions.verifyEnabled(
      this.locators.productTrigger,
      'Product trigger',
    );
  }

  async verifyTemplateVisibleAfterProductSelection(): Promise<void> {
    this.logger.info(
      'Verifying Template field is visible after product selection',
    );
    await this.assertions.verifyVisible(
      this.locators.templateTrigger,
      'Template trigger',
    );
  }

  async verifyTemplateValueIsLife(): Promise<void> {
    this.logger.info('Verifying Template value is Life');
    await this.assertions.verifyValue(
      this.locators.templateTrigger,
      this.testData.validApplication.template,
      'Template trigger',
    );
  }

  async verifyStartApplicationDisabledBeforeRequiredSelections(): Promise<void> {
    this.logger.info(
      'Verifying Start Application button is disabled before required selections',
    );
    await this.assertions.verifyDisabled(
      this.locators.startApplicationButton,
      'Start Application button',
    );
  }

  async verifyStartApplicationEnabledAfterValidSelections(): Promise<void> {
    this.logger.info(
      'Verifying Start Application button is enabled after valid selections',
    );
    await this.assertions.verifyEnabled(
      this.locators.startApplicationButton,
      'Start Application button',
    );
  }

  async verifyStateSelected(): Promise<void> {
    this.logger.info('Verifying selected state value');
    await this.assertions.verifyValue(
      this.locators.stateTrigger,
      this.testData.validApplication.state,
      'State trigger',
    );
  }

  async verifyTemplateEnabledAfterProductSelection(): Promise<void> {
    this.logger.info(
      'Verifying Template field is enabled after product selection',
    );
    await this.assertions.verifyEnabled(
      this.locators.templateTrigger,
      'Template trigger',
    );
  }

  async verifyApplicationsPageDisplayed(): Promise<void> {
    this.logger.info('Verifying Applications page is displayed');
    await this.assertions.verifyVisible(
      this.locators.applicationsPageHeading,
      'Applications page heading',
    );
  }

  async verifyApplicationCreationCompleted(): Promise<void> {
    this.logger.info('Verifying application creation completed');
    await this.assertions.verifyURL(
      new RegExp(
        `${this.escapeRegex(this.testData.page.applicationFormUrlPath)}`,
      ),
    );
  }

  async verifyApplicationFormShellDisplayed(): Promise<void> {
    this.logger.info('Verifying application form shell is displayed');
    await this.assertions.verifyURL(
      new RegExp(
        `${this.escapeRegex(this.testData.page.applicationFormUrlPath)}`,
      ),
    );
    await this.assertions.verifyVisible(
      this.locators.applicationSectionsHeading,
      'Application Sections heading',
    );
    await this.assertions.verifyContains(
      this.locators.applicationSectionsHeading,
      this.testData.page.applicationSectionsHeading,
      'Application Sections heading text',
    );
    await this.assertions.verifyVisible(
      this.locators.returnToApplicationsLink,
      'Return to Applications link',
    );
  }

  async waitForDashboardApplicationsReady(): Promise<void> {
    this.logger.info('Waiting for Applications dashboard list to be ready');
    await this.assertions.verifyVisible(
      this.locators.applicationsPageHeading,
      'Applications page heading',
    );
    await this.assertions.verifyVisible(
      this.locators.applicationsListPaginationStatus,
      'Applications list pagination status',
    );
  }

  async captureVisibleDashboardApplicationIds(): Promise<string[]> {
    await this.waitForDashboardApplicationsReady();
    const cards = this.locators.dashboardApplicationCardActionTriggers;
    const count = await cards.count();
    const applicationIds: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const testId = await cards.nth(index).getAttribute('data-testid');
      const applicationId = this.parseApplicationIdFromCardTestId(testId);
      if (applicationId) {
        applicationIds.push(applicationId);
      }
    }

    return applicationIds;
  }

  async verifyNewVerifiedApplicationRecordAppeared(
    previousApplicationIds: string[],
  ): Promise<void> {
    await this.waitForDashboardApplicationsReady();
    const newApplicationId = await this.waitForNewDashboardApplicationId(
      previousApplicationIds,
    );
    const { state, product, dashboardStatus } = this.testData.validApplication;
    const recordRow = this.locators.applicationRecordRow(newApplicationId);

    await this.assertions.verifyVisible(
      recordRow,
      'New verified application dashboard record',
    );
    await this.assertions.verifyContains(
      recordRow,
      state,
      'New verified application state',
    );
    await this.assertions.verifyContains(
      recordRow,
      product,
      'New verified application product',
    );
    await this.assertions.verifyContains(
      recordRow,
      dashboardStatus,
      'New verified application status',
    );
  }

  async verifyApplicationFormPageDisplayed(): Promise<void> {
    await this.verifyApplicationFormShellDisplayed();
  }

  async verifyProductAvailable(
    productCode: string,
    productName: string,
  ): Promise<void> {
    this.logger.info(
      `Verifying ${productName} is available in Product dropdown`,
    );
    await this.assertions.verifyVisible(
      this.locators.productOption(productCode),
      `${productName} product option`,
    );
  }

  async verifyProductNotAvailable(
    productCode: string,
    productName: string,
  ): Promise<void> {
    this.logger.info(
      `Verifying ${productName} is not available in Product dropdown`,
    );
    await this.assertions.verifyCount(
      this.locators.productOption(productCode),
      0,
      `${productName} product option`,
    );
  }

  async verifyStateNotAvailable(
    stateCode: string,
    stateName: string,
  ): Promise<void> {
    this.logger.info(
      `Verifying ${stateName} is not available in State dropdown`,
    );
    await this.assertions.verifyCount(
      this.locators.stateOption(stateCode),
      0,
      `${stateName} state option`,
    );
  }

  async verifyIulTemplateValue(): Promise<void> {
    this.logger.info('Verifying IUL template value');
    await this.assertions.verifyValue(
      this.locators.templateTrigger,
      this.testData.iul.template,
      'IUL Template trigger',
    );
  }

  async verifyIndexedUniversalLifeAvailable(): Promise<void> {
    await this.verifyProductAvailable(
      this.testData.iul.productCode,
      this.testData.iul.product,
    );
  }

  async verifyTermLifeAvailable(): Promise<void> {
    await this.verifyProductAvailable(
      this.testData.termLife.productCode,
      this.testData.termLife.product,
    );
  }

  async verifyTermLifeNotAvailable(): Promise<void> {
    await this.verifyProductNotAvailable(
      this.testData.termLife.productCode,
      this.testData.termLife.product,
    );
  }

  async verifyNewYorkNotAvailable(): Promise<void> {
    const newYork = this.testData.availability.excludedStates.find((state) =>
      /^New York$/i.test(state.state),
    );
    if (!newYork) {
      throw new Error('New York exclusion data is not configured');
    }

    await this.verifyStateNotAvailable(newYork.stateCode, newYork.state);
  }

  async verifyUsVirginIslandsNotAvailable(): Promise<void> {
    const usVirginIslands = this.testData.availability.excludedStates.find(
      (state) => /U\.S\. Virgin Islands/i.test(state.state),
    );
    if (!usVirginIslands) {
      throw new Error('U.S. Virgin Islands exclusion data is not configured');
    }

    await this.verifyStateNotAvailable(
      usVirginIslands.stateCode,
      usVirginIslands.state,
    );
  }

  async assertStateOptionCount(): Promise<void> {
    this.logger.info('Verifying State dropdown option count');
    await this.assertions.verifyCount(
      this.locators.stateDropdownOptions,
      this.testData.stateDropdown.expectedCount,
      'State dropdown options',
    );
  }

  async assertStateOptionsMatchExpected(
    actualLocations: string[],
  ): Promise<void> {
    this.logger.info('Verifying State dropdown locations match expected list');
    const expectedLocations = [
      ...this.testData.stateDropdown.expectedLocations,
    ];
    const actualSorted = [...actualLocations];
    const missingLocations = expectedLocations.filter(
      (location) => !actualSorted.includes(location),
    );
    const unexpectedLocations = actualSorted.filter(
      (location) => !expectedLocations.includes(location),
    );
    const passed =
      missingLocations.length === 0 && unexpectedLocations.length === 0;

    const expectedReport = [
      `Expected locations: ${expectedLocations.join(', ')}`,
      `Expected count: ${expectedLocations.length}`,
      `Missing locations: ${missingLocations.length ? missingLocations.join(', ') : 'None'}`,
      `Unexpected locations: ${unexpectedLocations.length ? unexpectedLocations.join(', ') : 'None'}`,
    ].join('\n');
    const actualReport = [
      `Actual locations: ${actualSorted.join(', ')}`,
      `Actual count: ${actualSorted.length}`,
    ].join('\n');

    await this.assertions.reportAssertionOutcome(
      'Verify State dropdown contains all expected available locations',
      expectedReport,
      actualReport,
      passed,
      'State dropdown locations',
    );
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private parseApplicationIdFromCardTestId(
    testId: string | null,
  ): string | undefined {
    if (!testId) {
      return undefined;
    }

    const match = testId.match(/^agp-dashboard-card-(.+)-actions-trigger$/i);
    return match ? match[1].toUpperCase() : undefined;
  }

  private async waitForNewDashboardApplicationId(
    previousApplicationIds: string[],
  ): Promise<string> {
    const navigationTimeout = getEnvironmentConfig().navigationTimeout;
    const deadline = Date.now() + navigationTimeout;
    let latestApplicationIds = previousApplicationIds;

    while (Date.now() < deadline) {
      latestApplicationIds = await this.readVisibleDashboardApplicationIds();
      const newApplicationId = latestApplicationIds.find(
        (applicationId) => !previousApplicationIds.includes(applicationId),
      );

      if (newApplicationId) {
        return newApplicationId;
      }

      await this.page.waitForTimeout(500);
    }

    await this.assertions.verifyVisible(
      this.locators.applicationRecordRow(''),
      'New verified application dashboard record',
    );

    return '';
  }

  private async readVisibleDashboardApplicationIds(): Promise<string[]> {
    const cards = this.locators.dashboardApplicationCardActionTriggers;
    const count = await cards.count();
    const applicationIds: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const testId = await cards.nth(index).getAttribute('data-testid');
      const applicationId = this.parseApplicationIdFromCardTestId(testId);
      if (applicationId) {
        applicationIds.push(applicationId);
      }
    }

    return applicationIds;
  }
}
