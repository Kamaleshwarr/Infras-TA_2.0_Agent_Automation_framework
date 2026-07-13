/** Environment variable keys — single source of truth. */
export const CONFIG_KEYS = {
  ENV: 'ENV',
  BROWSER: 'BROWSER',
  HEADLESS: 'HEADLESS',
  BASE_URL: 'BASE_URL',
  TAGS: 'TAGS',
  TIMEOUT: 'TIMEOUT',
  ACTION_TIMEOUT: 'ACTION_TIMEOUT',
  NAVIGATION_TIMEOUT: 'NAVIGATION_TIMEOUT',
  WORKERS: 'WORKERS',
  RETRIES: 'RETRIES',
  SLOW_MO: 'SLOW_MO',
  ENABLE_TRACING: 'ENABLE_TRACING',
  RECORD_VIDEO: 'RECORD_VIDEO',
  SCREENSHOT_ON_FAILURE: 'SCREENSHOT_ON_FAILURE',
  LOG_LEVEL: 'LOG_LEVEL',
} as const;

export const ARTIFACT_DEFAULTS = {
  enableTracing: false,
  recordVideo: false,
  screenshotOnFailure: true,
} as const;
