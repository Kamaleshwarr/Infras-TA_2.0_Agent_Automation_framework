import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import {
  Browser,
  BrowserContext,
  chromium,
  firefox,
  webkit,
  Page,
} from 'playwright';
import { getEnvironmentConfig } from '../config/environment.config';
import { getPlaywrightConfig } from '../config/playwright.config';
import { SupportedBrowser } from '../constants';
import { LoginPage } from '../pages/LoginPage';
import { createLogger } from '../utils/logger';

/**
 * Cucumber World — shared runtime state for each scenario.
 * Holds browser lifecycle objects and page object instances.
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  tracePath?: string;

  loginPage!: LoginPage;

  private readonly logger = createLogger('World');

  constructor(options: IWorldOptions) {
    super(options);
  }

  /** Re-initializes page objects after a new Playwright page is created. */
  initializePages(): void {
    this.loginPage = new LoginPage(this.page);
  }

  async launchBrowser(): Promise<void> {
    const config = getEnvironmentConfig();
    const pwConfig = getPlaywrightConfig();

    this.logger.info(
      `Launching ${config.browser} browser (headless: ${config.headless})`,
    );

    this.browser = await this.getBrowserType(config.browser).launch(
      pwConfig.launchOptions,
    );
  }

  async createContext(): Promise<void> {
    const pwConfig = getPlaywrightConfig();
    this.logger.info('Creating browser context');

    this.context = await this.browser.newContext(pwConfig.contextOptions);
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
  }

  async createPage(): Promise<void> {
    this.logger.info('Creating new page');
    this.page = await this.context.newPage();
    this.initializePages();
  }

  async closeBrowser(): Promise<void> {
    this.logger.info('Closing browser');
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  private getBrowserType(browser: SupportedBrowser) {
    switch (browser) {
      case 'firefox':
        return firefox;
      case 'webkit':
        return webkit;
      default:
        return chromium;
    }
  }
}

setWorldConstructor(CustomWorld);
