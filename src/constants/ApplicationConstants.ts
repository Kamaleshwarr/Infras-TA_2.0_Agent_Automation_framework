import { Environment } from '../enums';

/**
 * Transamerica Agent Portal base URL.
 * Override at runtime with BASE_URL env var when needed.
 */
export const AGENT_PORTAL_BASE_URL = 'https://secure.transamerica.com';

/**
 * Per-environment base URLs for the Transamerica Agent Portal.
 */
export const ENVIRONMENT_URLS: Record<Environment, string> = {
  [Environment.DEV]: AGENT_PORTAL_BASE_URL,
  [Environment.QA]: AGENT_PORTAL_BASE_URL,
  [Environment.UAT]: AGENT_PORTAL_BASE_URL,
  [Environment.PROD]: AGENT_PORTAL_BASE_URL,
};

export const ROUTES = {
  login: '/',
} as const;

export const TEST_DATA_FILES = {
  login: 'login.json',
  createApplication: 'create-application.json',
} as const;
