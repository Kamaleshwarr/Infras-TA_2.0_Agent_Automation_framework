import { getEnvironmentConfig } from '../config/environment.config';
import { createLogger } from './logger';

const logger = createLogger('RetryHelper');

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  label?: string;
  retryOn?: (error: unknown) => boolean;
}

const DEFAULT_DELAY_MS = 500;

/**
 * Retries transient failures for browser launch and critical actions.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const config = getEnvironmentConfig();
  const maxAttempts = (options.retries ?? config.retries) + 1;
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  const label = options.label ?? 'operation';
  const shouldRetry = options.retryOn ?? (() => true);

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === maxAttempts;
      const canRetry = shouldRetry(error);

      if (isLastAttempt || !canRetry) {
        throw error;
      }

      logger.warn(
        `${label} failed (attempt ${attempt}/${maxAttempts}). Retrying in ${delayMs}ms...`,
      );
      await delay(delayMs);
    }
  }

  throw lastError;
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
