const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

/**
 * Loads `.env.{env}` then `.env` before Cucumber starts.
 * Mirrors src/config/envLoader.ts for the Node.js bootstrap path.
 * Process environment variables set before this module loads take highest priority.
 */
function loadEnvironmentFiles() {
  const runtimeEnv = { ...process.env };
  const envName = (runtimeEnv.ENV || 'QA').toLowerCase();
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

loadEnvironmentFiles();

const workers = parseInt(process.env.WORKERS || '1', 10);

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/hooks/world.ts',
      'src/hooks/hooks.ts',
      'src/stepdefinitions/**/*.ts',
    ],
    paths: ['src/features/**/*.feature'],
    format: [
      'progress-bar',
      'json:src/reports/cucumber-report.json',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      resultsDir: 'src/reports/allure-results',
    },
    tags: process.env.TAGS || '',
    parallel: workers > 1 ? workers : undefined,
  },
};
