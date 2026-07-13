import { Environment } from '../enums';

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

export const ROUTES = {
  login: '/',
  inventory: '/inventory.html',
} as const;

export const TEST_DATA_FILES = {
  login: 'login.json',
} as const;
