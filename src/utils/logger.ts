import winston from 'winston';
import { LOG_LEVELS, LogLevel } from '../constants';

const logLevel =
  (process.env.LOG_LEVEL?.toUpperCase() as LogLevel) ?? LOG_LEVELS.INFO;

const baseLogger = winston.createLogger({
  level: logLevel.toLowerCase(),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.printf(({ timestamp, level, message, context }) => {
      const ctx = context ? `[${context}] ` : '';
      return `[${timestamp}] [${level.toUpperCase()}] ${ctx}${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

/**
 * Enterprise logger wrapping Winston with per-component context.
 */
export class Logger {
  constructor(private readonly context: string) {}

  debug(message: string): void {
    baseLogger.debug(message, { context: this.context });
  }

  info(message: string): void {
    baseLogger.info(message, { context: this.context });
  }

  warn(message: string): void {
    baseLogger.warn(message, { context: this.context });
  }

  error(message: string): void {
    baseLogger.error(message, { context: this.context });
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}
