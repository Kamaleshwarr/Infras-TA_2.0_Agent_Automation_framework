import {
  BrowserType as PWBrowserType,
  BrowserContextOptions,
  chromium,
  firefox,
  webkit,
  LaunchOptions,
} from 'playwright';
import { BrowserType, SupportedBrowser } from '../enums';
import { IBrowserFactory } from '../interfaces';

const START_MAXIMIZED_ARG = '--start-maximized';

/**
 * Resolves Playwright browser types and launch options from environment config.
 */
export class BrowserFactory implements IBrowserFactory {
  getBrowserType(browser: SupportedBrowser): PWBrowserType {
    switch (browser) {
      case BrowserType.FIREFOX:
        return firefox;
      case BrowserType.WEBKIT:
        return webkit;
      case BrowserType.CHROME:
      case BrowserType.EDGE:
      case BrowserType.CHROMIUM:
      default:
        return chromium;
    }
  }

  getLaunchOptions(
    browser: SupportedBrowser,
    baseOptions: LaunchOptions,
  ): LaunchOptions {
    let options: LaunchOptions = { ...baseOptions };

    switch (browser) {
      case BrowserType.CHROME:
        options = { ...options, channel: 'chrome' };
        break;
      case BrowserType.EDGE:
        options = { ...options, channel: 'msedge' };
        break;
    }

    if (!baseOptions.headless) {
      options = this.applyHeadedLaunchOptions(browser, options);
    }

    return options;
  }

  getContextOptions(
    baseOptions: BrowserContextOptions,
    headless: boolean,
  ): BrowserContextOptions {
    if (headless) {
      return baseOptions;
    }

    return {
      ...baseOptions,
      viewport: null,
    };
  }

  private applyHeadedLaunchOptions(
    browser: SupportedBrowser,
    options: LaunchOptions,
  ): LaunchOptions {
    if (!this.usesChromiumLauncher(browser)) {
      return options;
    }

    const existingArgs = options.args ?? [];
    if (existingArgs.includes(START_MAXIMIZED_ARG)) {
      return options;
    }

    return {
      ...options,
      args: [...existingArgs, START_MAXIMIZED_ARG],
    };
  }

  private usesChromiumLauncher(browser: SupportedBrowser): boolean {
    return (
      browser === BrowserType.CHROMIUM ||
      browser === BrowserType.CHROME ||
      browser === BrowserType.EDGE
    );
  }
}

export const browserFactory = new BrowserFactory();
