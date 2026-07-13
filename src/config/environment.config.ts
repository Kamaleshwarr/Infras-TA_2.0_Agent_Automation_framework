import {
  DEFAULT_BROWSER,
  DEFAULT_TIMEOUTS,
  DEFAULT_VIEWPORT,
  ENVIRONMENT_URLS,
  CONFIG_KEYS,
  ARTIFACT_DEFAULTS,
} from '../constants';
import { BrowserType, Environment, DEFAULT_ENVIRONMENT } from '../enums';
import { ConfigurationException } from '../exceptions';
import { loadEnvironmentFiles } from './envLoader';

let environmentLoaded = false;

export interface EnvironmentConfig {
  environment: Environment;
  baseUrl: string;
  browser: BrowserType;
  headless: boolean;
  viewport: { width: number; height: number };
  timeout: number;
  actionTimeout: number;
  navigationTimeout: number;
  workers: number;
  retries: number;
  slowMo: number;
  enableTracing: boolean;
  recordVideo: boolean;
  screenshotOnFailure: boolean;
}

function ensureEnvironmentLoaded(): void {
  if (!environmentLoaded) {
    loadEnvironmentFiles();
    environmentLoaded = true;
  }
}

function parseEnvironment(value: string | undefined): Environment {
  const normalized = (value ?? DEFAULT_ENVIRONMENT).toUpperCase();
  if (Object.values(Environment).includes(normalized as Environment)) {
    return normalized as Environment;
  }
  throw new ConfigurationException(
    `Invalid ${CONFIG_KEYS.ENV} "${value}". Supported: ${Object.values(Environment).join(', ')}`,
  );
}

function parseBrowser(value: string | undefined): BrowserType {
  const browser = (value ?? DEFAULT_BROWSER).toLowerCase();
  if (Object.values(BrowserType).includes(browser as BrowserType)) {
    return browser as BrowserType;
  }
  throw new ConfigurationException(
    `Invalid ${CONFIG_KEYS.BROWSER} "${value}". Supported: ${Object.values(BrowserType).join(', ')}`,
  );
}

function parseBoolean(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new ConfigurationException(
      `Invalid numeric configuration value: "${value}"`,
    );
  }
  return parsed;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  ensureEnvironmentLoaded();

  const environment = parseEnvironment(process.env.ENV);
  const baseUrl = process.env.BASE_URL?.trim() || ENVIRONMENT_URLS[environment];

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
    enableTracing: parseBoolean(
      process.env.ENABLE_TRACING,
      ARTIFACT_DEFAULTS.enableTracing,
    ),
    recordVideo: parseBoolean(
      process.env.RECORD_VIDEO,
      ARTIFACT_DEFAULTS.recordVideo,
    ),
    screenshotOnFailure: parseBoolean(
      process.env.SCREENSHOT_ON_FAILURE,
      ARTIFACT_DEFAULTS.screenshotOnFailure,
    ),
  };
}
