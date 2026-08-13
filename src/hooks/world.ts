import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from 'playwright';
import { ApplicationCreationAssertions } from '../assertions/ApplicationCreationAssertions';
import { LicensingAssertions } from '../assertions/LicensingAssertions';
import { LoginAssertions } from '../assertions/LoginAssertions';
import { getPlaywrightConfig } from '../config/playwright.config';
import { dependencies } from '../core/DependencyRegistry';
import { CucumberAttach } from '../interfaces';
import { ApplicationCreationPage } from '../pages/ApplicationCreationPage';
import { LicensingPage } from '../pages/LicensingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
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
  dashboardApplicationIdsBefore?: string[];
  capturedStateDropdownOptions?: string[];

  private readonly logger = dependencies.createLogger('World');

  constructor(options: IWorldOptions) {
    super(options);
  }

  initializePages(): void {
    const attach = this.attach.bind(this) as CucumberAttach;
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
