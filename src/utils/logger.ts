import { LOG_LEVELS, LogLevel } from '../constants';

/**
 * Structured console logger for traceability during test execution.
 * Every framework action logs meaningful context for debugging and reporting.
 */
export class Logger {
  private readonly context: string;
  private readonly minLevel: LogLevel;

  constructor(context: string, minLevel: LogLevel = LOG_LEVELS.INFO) {
    this.context = context;
    this.minLevel = minLevel;
  }

  debug(message: string): void {
    this.log(LOG_LEVELS.DEBUG, message);
  }

  info(message: string): void {
    this.log(LOG_LEVELS.INFO, message);
  }

  warn(message: string): void {
    this.log(LOG_LEVELS.WARN, message);
  }

  error(message: string): void {
    this.log(LOG_LEVELS.ERROR, message);
  }

  private log(level: LogLevel, message: string): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] [${this.context}] ${message}`);
  }

  private shouldLog(level: LogLevel): boolean {
    const order: LogLevel[] = [
      LOG_LEVELS.DEBUG,
      LOG_LEVELS.INFO,
      LOG_LEVELS.WARN,
      LOG_LEVELS.ERROR,
    ];
    return order.indexOf(level) >= order.indexOf(this.minLevel);
  }
}

export function createLogger(context: string): Logger {
  const level = (process.env.LOG_LEVEL?.toUpperCase() as LogLevel) ?? LOG_LEVELS.INFO;
  return new Logger(context, level);
}
