import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from 'playwright';
import { ApplicationCreationAssertions } from '../assertions/ApplicationCreationAssertions';
import { LicensingAssertions } from '../assertions/LicensingAssertions';
import { LoginAssertions } from '../assertions/LoginAssertions';
import { ProposedPrimaryInsuredPage1Assertions } from '../assertions/ProposedPrimaryInsuredPage1Assertions';
import { getPlaywrightConfig } from '../config/playwright.config';
import { dependencies } from '../core/DependencyRegistry';
import { CucumberAttach } from '../interfaces';
import { ApplicationCreationPage } from '../pages/ApplicationCreationPage';
import { LicensingPage } from '../pages/LicensingPage';
import { ProposedPrimaryInsuredPage1Page } from '../pages/ProposedPrimaryInsuredPage1Page';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PiPage1ExecutionContext } from '../utils/proposed-primary-insured/PiPage1ExecutionContext';
import { applyPendingAllureHierarchyOnce } from '../utils/report/allureHierarchy';
import { browserManager } from './browserManager';

/**
 * Cucumber World — shared runtime state for each scenario.
 */
export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  tracePath?: string;
  scenarioName?: string;

  loginPage!: LoginPage;
  loginAssertions!: LoginAssertions;
  dashboardPage!: DashboardPage;
  applicationCreationPage!: ApplicationCreationPage;
  applicationCreationAssertions!: ApplicationCreationAssertions;
  licensingPage!: LicensingPage;
  licensingAssertions!: LicensingAssertions;
  proposedPrimaryInsuredPage1Page!: ProposedPrimaryInsuredPage1Page;
  proposedPrimaryInsuredPage1Assertions!: ProposedPrimaryInsuredPage1Assertions;
  dashboardApplicationIdsBefore?: string[];
  capturedStateDropdownOptions?: string[];
  piPage1ExecutionContext?: PiPage1ExecutionContext;

  private readonly logger = dependencies.createLogger('World');

  requirePiPage1ApplicationState(): string {
    if (!this.piPage1ExecutionContext?.stateName) {
      throw new Error(
        'Proposed Primary Insured Page 1 application state is not set. Start the scenario with the Given step that selects the application state.',
      );
    }
    return this.piPage1ExecutionContext.stateName;
  }

  constructor(options: IWorldOptions) {
    super(options);
  }

  initializePages(): void {
    const baseAttach = this.attach.bind(this) as CucumberAttach;
    const attach: CucumberAttach = async (data, mediaType) => {
      await applyPendingAllureHierarchyOnce();
      return baseAttach(data, mediaType);
    };
    this.loginPage = new LoginPage(this.page);
    this.loginAssertions = new LoginAssertions(this.page, attach);
    this.dashboardPage = new DashboardPage(this.page);
    this.applicationCreationPage = new ApplicationCreationPage(this.page);
    this.applicationCreationAssertions = new ApplicationCreationAssertions(
      this.page,
      attach,
    );
    this.licensingPage = new LicensingPage(this.page);
    this.licensingAssertions = new LicensingAssertions(
      this.page,
      attach,
      this.licensingPage,
    );
    this.proposedPrimaryInsuredPage1Page = new ProposedPrimaryInsuredPage1Page(
      this.page,
    );
    this.proposedPrimaryInsuredPage1Assertions =
      new ProposedPrimaryInsuredPage1Assertions(
        this.page,
        attach,
        this.proposedPrimaryInsuredPage1Page,
      );
  }

  async createContext(): Promise<void> {
    const pwConfig = getPlaywrightConfig();
    const browser = await browserManager.getBrowser();

    this.logger.info('Creating isolated browser context');
    this.context = await browser.newContext(pwConfig.contextOptions);

    if (pwConfig.enableTracing) {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
    }
  }

  async createPage(): Promise<void> {
    this.logger.info('Creating new page');
    this.page = await this.context.newPage();
    this.initializePages();
  }

  async closeContext(): Promise<void> {
    this.logger.info('Closing browser context');
    if (this.context) {
      await this.context.close();
    }
  }
}

setWorldConstructor(CustomWorld);
