import { Browser, chromium, firefox, webkit } from 'playwright';
import { getEnvironmentConfig } from '../config/environment.config';
import { getPlaywrightConfig } from '../config/playwright.config';
import { SupportedBrowser } from '../constants';
import { createLogger } from '../utils/logger';

const logger = createLogger('BrowserManager');

/**
 * Reuses one browser instance per Cucumber worker process.
 * Avoids launching a new browser for every scenario in parallel CI runs.
 */
class BrowserManager {
  private browser: Browser | null = null;

  async getBrowser(): Promise<Browser> {
    if (this.browser?.isConnected()) {
      return this.browser;
    }

    const config = getEnvironmentConfig();
    const pwConfig = getPlaywrightConfig();

    logger.info(
      `Launching ${config.browser} browser (headless: ${config.headless})`,
    );

    this.browser = await this.resolveBrowserType(config.browser).launch(
      pwConfig.launchOptions,
    );
    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    if (!this.browser) return;

    logger.info('Closing shared browser instance');
    await this.browser.close();
    this.browser = null;
  }

  private resolveBrowserType(browser: SupportedBrowser) {
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

export const browserManager = new BrowserManager();
