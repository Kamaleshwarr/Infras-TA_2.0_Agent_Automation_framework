import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from 'playwright';
import { getPlaywrightConfig } from '../config/playwright.config';
import { dependencies } from '../core/DependencyRegistry';
import { ApplicationWizardPage } from '../pages/ApplicationWizardPage';
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

  loginPage!: LoginPage;
  dashboardPage!: DashboardPage;
  applicationWizardPage!: ApplicationWizardPage;

  private readonly logger = dependencies.createLogger('World');

  constructor(options: IWorldOptions) {
    super(options);
  }

  initializePages(): void {
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.applicationWizardPage = new ApplicationWizardPage(this.page);
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
