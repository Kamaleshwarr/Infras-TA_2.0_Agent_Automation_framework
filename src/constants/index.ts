/**
 * @deprecated Import from specific constant modules or enums instead.
 * Retained as barrel export for backward compatibility.
 */
export {
  FRAMEWORK_NAME,
  FRAMEWORK_VERSION,
  MIN_NODE_VERSION,
  DEFAULT_VIEWPORT,
  SENSITIVE_FIELD_PATTERNS,
} from './FrameworkConstants';
export { DEFAULT_TIMEOUTS, RETRY_DELAY_MS } from './TimeoutConstants';
export { REPORT_PATHS, REPORT_FILES } from './PathConstants';
export { CONFIG_KEYS, ARTIFACT_DEFAULTS } from './ReportConstants';
export {
  ENVIRONMENT_URLS,
  ROUTES,
  TEST_DATA_FILES,
} from './ApplicationConstants';

export {
  BrowserType,
  SUPPORTED_BROWSERS,
  DEFAULT_BROWSER,
  Environment,
  DEFAULT_ENVIRONMENT,
  LogLevel,
  TEST_TAGS,
  TagType,
} from '../enums';
export type { SupportedBrowser } from '../enums';

/** @deprecated Use LogLevel enum */
export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

export type LogLevelLegacy = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
