import {
  DEFAULT_BROWSER,
  DEFAULT_ENVIRONMENT,
  DEFAULT_TIMEOUTS,
  DEFAULT_VIEWPORT,
  ENVIRONMENT_URLS,
  Environment,
  SupportedBrowser,
  SUPPORTED_BROWSERS,
} from '../constants';

/**
 * Resolved runtime configuration built from environment variables.
 * Single source of truth — no hardcoded values in page or step files.
 */
export interface EnvironmentConfig {
  environment: Environment;
  baseUrl: string;
  browser: SupportedBrowser;
  headless: boolean;
  viewport: { width: number; height: number };
  timeout: number;
  actionTimeout: number;
  navigationTimeout: number;
  workers: number;
  retries: number;
  slowMo: number;
}

function parseEnvironment(value: string | undefined): Environment {
  const normalized = (value ?? DEFAULT_ENVIRONMENT).toUpperCase();
  if (Object.values(Environment).includes(normalized as Environment)) {
    return normalized as Environment;
  }
  throw new Error(
    `Invalid ENV "${value}". Supported: ${Object.values(Environment).join(', ')}`,
  );
}

function parseBrowser(value: string | undefined): SupportedBrowser {
  const browser = (value ?? DEFAULT_BROWSER).toLowerCase() as SupportedBrowser;
  if (!SUPPORTED_BROWSERS.includes(browser)) {
    throw new Error(
      `Invalid BROWSER "${value}". Supported: ${SUPPORTED_BROWSERS.join(', ')}`,
    );
  }
  return browser;
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric value: "${value}"`);
  }
  return parsed;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = parseEnvironment(process.env.ENV);
  const baseUrl =
    process.env.BASE_URL?.trim() || ENVIRONMENT_URLS[environment];

  return {
    environment,
    baseUrl,
    browser: parseBrowser(process.env.BROWSER),
    headless: parseBoolean(process.env.HEADLESS, true),
    viewport: DEFAULT_VIEWPORT,
    timeout: parseNumber(process.env.TIMEOUT, DEFAULT_TIMEOUTS.test),
    actionTimeout: parseNumber(
      process.env.ACTION_TIMEOUT,
      DEFAULT_TIMEOUTS.action,
    ),
    navigationTimeout: parseNumber(
      process.env.NAVIGATION_TIMEOUT,
      DEFAULT_TIMEOUTS.navigation,
    ),
    workers: parseNumber(process.env.WORKERS, 1),
    retries: parseNumber(process.env.RETRIES, 0),
    slowMo: parseNumber(process.env.SLOW_MO, 0),
  };
}
