import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { DEFAULT_ENVIRONMENT, Environment } from '../enums';
import { ConfigurationException } from '../exceptions';

/**
 * Loads environment-specific configuration files in priority order:
 * 1. `.env.{env}` (e.g. `.env.qa`)
 * 2. `.env` (local overrides)
 * 3. Process environment variables (highest priority — preserved from before load)
 */
export function loadEnvironmentFiles(): void {
  const runtimeEnv = { ...process.env };
  const envName = (runtimeEnv.ENV ?? DEFAULT_ENVIRONMENT).toLowerCase();
  const rootDir = process.cwd();

  const envSpecificFile = path.resolve(rootDir, `.env.${envName}`);
  if (fs.existsSync(envSpecificFile)) {
    dotenv.config({ path: envSpecificFile });
  }

  const defaultEnvFile = path.resolve(rootDir, '.env');
  if (fs.existsSync(defaultEnvFile)) {
    dotenv.config({ path: defaultEnvFile, override: true });
  }

  for (const [key, value] of Object.entries(runtimeEnv)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
}

export function resolveEnvironmentName(): Environment {
  const normalized = (process.env.ENV ?? DEFAULT_ENVIRONMENT).toUpperCase();
  if (Object.values(Environment).includes(normalized as Environment)) {
    return normalized as Environment;
  }
  throw new ConfigurationException(
    `Invalid ENV "${process.env.ENV}". Supported: ${Object.values(Environment).join(', ')}`,
  );
}
