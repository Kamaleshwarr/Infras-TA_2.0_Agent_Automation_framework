import * as path from 'path';
import { pathToFileURL } from 'url';
import { Environment } from '../enums';

const AGENT_PORTAL_ROOT = path.resolve(__dirname, '../resources/agent-portal');

/**
 * Resolves a demo agent portal page to a file URL for Playwright navigation.
 */
function portalPageUrl(filename: string): string {
  return pathToFileURL(path.join(AGENT_PORTAL_ROOT, filename)).href;
}

const DEMO_LOGIN_URL = portalPageUrl('login.html');

/**
 * Per-environment base URLs.
 * Demo environments use the local agent portal; override at runtime with BASE_URL.
 */
export const ENVIRONMENT_URLS: Record<Environment, string> = {
  [Environment.DEV]: DEMO_LOGIN_URL,
  [Environment.QA]: DEMO_LOGIN_URL,
  [Environment.UAT]: DEMO_LOGIN_URL,
  [Environment.PROD]: DEMO_LOGIN_URL,
};

export const ROUTES = {
  login: DEMO_LOGIN_URL,
  dashboard: portalPageUrl('dashboard.html'),
  applicationWizard: portalPageUrl('application-wizard.html'),
} as const;

export const TEST_DATA_FILES = {
  login: 'login.json',
  createApplication: 'create-application.json',
} as const;
