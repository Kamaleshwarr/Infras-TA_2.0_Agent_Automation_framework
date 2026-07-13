import winston from 'winston';
import { DEFAULT_LOG_LEVEL, LogLevel } from '../../enums';
import { ILogger } from '../../interfaces';
import { maskValue } from '../string/maskHelper';

const logLevel =
  (process.env.LOG_LEVEL?.toUpperCase() as LogLevel) ?? DEFAULT_LOG_LEVEL;

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
 * Winston-based logger with per-component context and sensitive value masking.
 */
export class Logger implements ILogger {
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

  /** Logs a field value, automatically masking sensitive fields. */
  infoField(fieldName: string, value: string): void {
    this.info(`${fieldName}: ${maskValue(value, fieldName)}`);
  }
}

export function createLogger(context: string): ILogger {
  return new Logger(context);
}
