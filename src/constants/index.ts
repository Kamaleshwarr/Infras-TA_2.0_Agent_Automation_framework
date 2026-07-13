/**
 * Supported deployment environments.
 * Switch via ENV environment variable without code changes.
 */
export enum Environment {
  DEV = 'DEV',
  QA = 'QA',
  UAT = 'UAT',
  PROD = 'PROD',
}

export const DEFAULT_ENVIRONMENT = Environment.QA;

/**
 * Per-environment base URLs.
 * Override at runtime with BASE_URL env var when needed.
 */
export const ENVIRONMENT_URLS: Record<Environment, string> = {
  [Environment.DEV]: 'https://www.saucedemo.com',
  [Environment.QA]: 'https://www.saucedemo.com',
  [Environment.UAT]: 'https://www.saucedemo.com',
  [Environment.PROD]: 'https://www.saucedemo.com',
};

export const SUPPORTED_BROWSERS = [
  'chromium',
  'chrome',
  'firefox',
  'edge',
  'webkit',
] as const;
export type SupportedBrowser = (typeof SUPPORTED_BROWSERS)[number];

export const DEFAULT_BROWSER: SupportedBrowser = 'chromium';

/** Recommended Cucumber tags for suite filtering. */
export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  SANITY: '@sanity',
  CRITICAL: '@critical',
  UI: '@ui',
  API: '@api',
  WIP: '@wip',
} as const;

export const DEFAULT_VIEWPORT = { width: 1280, height: 720 };

export const DEFAULT_TIMEOUTS = {
  test: 60_000,
  action: 15_000,
  navigation: 30_000,
} as const;

export const REPORT_PATHS = {
  allureResults: 'src/reports/allure-results',
  allureReport: 'src/reports/allure-report',
  screenshots: 'src/reports/screenshots',
  videos: 'src/reports/videos',
  traces: 'src/reports/traces',
} as const;

export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

export const ROUTES = {
  login: '/',
  inventory: '/inventory.html',
} as const;
