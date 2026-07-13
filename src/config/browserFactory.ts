import {
  BrowserType,
  chromium,
  firefox,
  webkit,
  LaunchOptions,
} from 'playwright';
import { SupportedBrowser } from '../constants';

/**
 * Factory for resolving Playwright browser types and launch options.
 * Browser selection is driven entirely by the BROWSER environment variable.
 */
export class BrowserFactory {
  static getBrowserType(browser: SupportedBrowser): BrowserType {
    switch (browser) {
      case 'firefox':
        return firefox;
      case 'webkit':
        return webkit;
      case 'chrome':
      case 'edge':
      case 'chromium':
      default:
        return chromium;
    }
  }

  static getLaunchOptions(
    browser: SupportedBrowser,
    baseOptions: LaunchOptions,
  ): LaunchOptions {
    switch (browser) {
      case 'chrome':
        return { ...baseOptions, channel: 'chrome' };
      case 'edge':
        return { ...baseOptions, channel: 'msedge' };
      default:
        return baseOptions;
    }
  }
}
