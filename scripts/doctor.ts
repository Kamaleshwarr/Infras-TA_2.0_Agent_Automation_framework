#!/usr/bin/env ts-node
/**
 * Framework health check — validates environment, dependencies, and structure.
 * Usage: npm run doctor
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import {
  FRAMEWORK_NAME,
  FRAMEWORK_VERSION,
  MIN_NODE_VERSION,
} from '../src/constants/FrameworkConstants';
import { REPORT_PATHS } from '../src/constants/PathConstants';
import { BrowserType, Environment } from '../src/enums';
import { loadEnvironmentFiles } from '../src/config/envLoader';
import { getEnvironmentConfig } from '../src/config/environment.config';

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, passed: boolean, message: string): void {
  results.push({ name, passed, message });
  const icon = passed ? '✓' : '✗';
  console.log(`  ${icon} ${name}: ${message}`);
}

function main(): void {
  console.log(`\n${FRAMEWORK_NAME} v${FRAMEWORK_VERSION} — Health Check\n`);

  checkNodeVersion();
  checkPlaywrightBrowsers();
  checkEnvironmentConfig();
  checkRequiredFolders();
  checkRequiredFiles();
  checkAllureAvailability();
  checkDependencyHealth();

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\n--- Summary ---`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFramework health check FAILED. Resolve issues above.\n');
    process.exit(1);
  }

  console.log('\nFramework health check PASSED. Ready for execution.\n');
}

function checkNodeVersion(): void {
  const major = parseInt(process.version.slice(1).split('.')[0] ?? '0', 10);
  check(
    'Node.js version',
    major >= MIN_NODE_VERSION,
    `${process.version} (minimum v${MIN_NODE_VERSION})`,
  );
}

function checkPlaywrightBrowsers(): void {
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
    check('Playwright CLI', true, 'Available');
  } catch {
    check('Playwright CLI', false, 'Not found — run npm install');
    return;
  }

  try {
    const browserPath = path.join(
      process.env.HOME ?? '',
      '.cache/ms-playwright',
    );
    const hasBrowsers =
      fs.existsSync(browserPath) &&
      fs.readdirSync(browserPath).some((d) => d.includes('chromium'));
    check(
      'Playwright browsers',
      hasBrowsers,
      hasBrowsers
        ? 'Chromium installed'
        : 'Run: npx playwright install chromium',
    );
  } catch {
    check('Playwright browsers', false, 'Unable to verify installation');
  }
}

function checkEnvironmentConfig(): void {
  try {
    loadEnvironmentFiles();
    const config = getEnvironmentConfig();
    const validEnv = Object.values(Environment).includes(config.environment);
    const validBrowser = Object.values(BrowserType).includes(config.browser);
    check(
      'Environment config',
      validEnv && validBrowser && !!config.baseUrl,
      `ENV=${config.environment}, BROWSER=${config.browser}, URL=${config.baseUrl}`,
    );
  } catch (error) {
    check(
      'Environment config',
      false,
      error instanceof Error ? error.message : 'Invalid configuration',
    );
  }
}

function checkRequiredFolders(): void {
  const folders = [
    'src/base',
    'src/config',
    'src/constants',
    'src/enums',
    'src/exceptions',
    'src/interfaces',
    'src/core',
    'src/hooks',
    'src/pages',
    'src/locators',
    'src/features',
    'src/stepdefinitions',
    'src/testdata',
    'src/utils',
    REPORT_PATHS.allureResults,
  ];

  const missing = folders.filter(
    (f) => !fs.existsSync(path.resolve(process.cwd(), f)),
  );

  check(
    'Required folders',
    missing.length === 0,
    missing.length === 0
      ? `${folders.length} folders present`
      : `Missing: ${missing.join(', ')}`,
  );
}

function checkRequiredFiles(): void {
  const files = [
    'package.json',
    'tsconfig.json',
    'cucumber.js',
    '.env.example',
    '.env.qa',
    'src/core/DependencyRegistry.ts',
    'src/config/browserFactory.ts',
    'src/utils/common/logger.ts',
    'src/utils/report/allureReportManager.ts',
  ];

  const missing = files.filter(
    (f) => !fs.existsSync(path.resolve(process.cwd(), f)),
  );

  check(
    'Required files',
    missing.length === 0,
    missing.length === 0
      ? `${files.length} files present`
      : `Missing: ${missing.join(', ')}`,
  );
}

function checkAllureAvailability(): void {
  try {
    execSync('npx allure --version', { stdio: 'pipe' });
    check('Allure CLI', true, 'Available');
  } catch {
    check(
      'Allure CLI',
      false,
      'Not found — run npm install (allure-commandline)',
    );
  }
}

function checkDependencyHealth(): void {
  try {
    execSync(
      'npm ls --depth=0 playwright winston @cucumber/cucumber 2>/dev/null',
      {
        stdio: 'pipe',
      },
    );
    check('Core dependencies', true, 'playwright, winston, cucumber installed');
  } catch {
    check('Core dependencies', false, 'Run npm install');
  }
}

main();
