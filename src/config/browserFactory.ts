import {
  BrowserType as PWBrowserType,
  chromium,
  firefox,
  webkit,
  LaunchOptions,
} from 'playwright';
import { BrowserType, SupportedBrowser } from '../enums';
import { IBrowserFactory } from '../interfaces';

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
    switch (browser) {
      case BrowserType.CHROME:
        return { ...baseOptions, channel: 'chrome' };
      case BrowserType.EDGE:
        return { ...baseOptions, channel: 'msedge' };
      default:
        return baseOptions;
    }
  }
}

export const browserFactory = new BrowserFactory();
