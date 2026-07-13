import { Browser } from 'playwright';
import { getEnvironmentConfig } from '../config/environment.config';
import { getPlaywrightConfig } from '../config/playwright.config';
import { dependencies } from '../core/DependencyRegistry';
import { BrowserLaunchException } from '../exceptions';
import { withRetry } from '../utils/common/retryHelper';

/**
 * Reuses one browser instance per Cucumber worker process.
 */
class BrowserManager {
  private browser: Browser | null = null;

  async getBrowser(): Promise<Browser> {
    if (this.browser?.isConnected()) {
      return this.browser;
    }

    const config = getEnvironmentConfig();
    const pwConfig = getPlaywrightConfig();
    const factory = dependencies.getBrowserFactory();
    const browserType = factory.getBrowserType(config.browser);
    const launchOptions = factory.getLaunchOptions(
      config.browser,
      pwConfig.launchOptions,
    );

    const logger = dependencies.createLogger('BrowserManager');
    logger.info(
      `Launching ${config.browser} browser (headless: ${config.headless})`,
    );

    try {
      this.browser = await withRetry(() => browserType.launch(launchOptions), {
        label: `Launch ${config.browser}`,
        retryOn: (error) => this.isTransientBrowserError(error),
      });
    } catch (error) {
      throw new BrowserLaunchException(config.browser, error);
    }

    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    if (!this.browser) return;

    dependencies
      .createLogger('BrowserManager')
      .info('Closing shared browser instance');
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
