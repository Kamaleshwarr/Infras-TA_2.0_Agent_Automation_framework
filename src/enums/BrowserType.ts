/**
 * Supported Playwright browser engines.
 * Configure via BROWSER environment variable — no code changes required.
 */
export enum BrowserType {
  CHROMIUM = 'chromium',
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  EDGE = 'edge',
  WEBKIT = 'webkit',
}

export const SUPPORTED_BROWSERS = Object.values(BrowserType);
export type SupportedBrowser = BrowserType;

export const DEFAULT_BROWSER = BrowserType.CHROMIUM;
