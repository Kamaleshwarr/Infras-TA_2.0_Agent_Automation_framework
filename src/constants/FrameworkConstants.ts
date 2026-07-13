import { DEFAULT_BROWSER, DEFAULT_ENVIRONMENT } from '../enums';
import packageJson from '../../package.json';

export const FRAMEWORK_NAME = packageJson.name;
export const FRAMEWORK_VERSION = packageJson.version;

export const MIN_NODE_VERSION = 18;

export const DEFAULT_VIEWPORT = { width: 1280, height: 720 } as const;

export { DEFAULT_BROWSER, DEFAULT_ENVIRONMENT };

/** Sensitive field names — never log values for these. */
export const SENSITIVE_FIELD_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /credential/i,
  /apikey/i,
  /api_key/i,
] as const;
