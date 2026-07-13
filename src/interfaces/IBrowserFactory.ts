import { BrowserType as PWBrowserType, LaunchOptions } from 'playwright';
import { SupportedBrowser } from '../enums';

/**
 * Contract for browser type resolution and launch option configuration.
 */
export interface IBrowserFactory {
  getBrowserType(browser: SupportedBrowser): PWBrowserType;
  getLaunchOptions(
    browser: SupportedBrowser,
    baseOptions: LaunchOptions,
  ): LaunchOptions;
}
