/**
 * Log severity levels for Winston logger.
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export const DEFAULT_LOG_LEVEL = LogLevel.INFO;
