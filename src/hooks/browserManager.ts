import { Browser } from 'playwright';
import { BrowserFactory } from '../config/browserFactory';
import { getEnvironmentConfig } from '../config/environment.config';
import { getPlaywrightConfig } from '../config/playwright.config';
import { createLogger } from '../utils/logger';
import { withRetry } from '../utils/retryHelper';

const logger = createLogger('BrowserManager');

/**
 * Reuses one browser instance per Cucumber worker process.
 * Delegates browser resolution to BrowserFactory.
 */
class BrowserManager {
  private browser: Browser | null = null;

  async getBrowser(): Promise<Browser> {
    if (this.browser?.isConnected()) {
      return this.browser;
    }

    const config = getEnvironmentConfig();
    const pwConfig = getPlaywrightConfig();
    const browserType = BrowserFactory.getBrowserType(config.browser);
    const launchOptions = BrowserFactory.getLaunchOptions(
      config.browser,
      pwConfig.launchOptions,
    );

    logger.info(
      `Launching ${config.browser} browser (headless: ${config.headless})`,
    );

    this.browser = await withRetry(() => browserType.launch(launchOptions), {
      label: `Launch ${config.browser}`,
      retryOn: (error) => this.isTransientBrowserError(error),
    });

    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    if (!this.browser) return;

    logger.info('Closing shared browser instance');
    await this.browser.close();
    this.browser = null;
  }

  private isTransientBrowserError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return (
      message.includes('browser') ||
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('closed')
    );
  }
}

export const browserManager = new BrowserManager();
