#!/usr/bin/env ts-node
/**
 * Framework health check — validates environment, dependencies, and structure.
 * Usage: npm run doctor
 */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { chromium, firefox, webkit } from 'playwright';
import {
  FRAMEWORK_NAME,
  FRAMEWORK_VERSION,
  MIN_NODE_VERSION,
} from '../src/constants/FrameworkConstants';
import { REPORT_PATHS } from '../src/constants/PathConstants';
import { BrowserType, Environment } from '../src/enums';
import { loadEnvironmentFiles } from '../src/config/envLoader';
import { getEnvironmentConfig } from '../src/config/environment.config';

type CheckStatus = 'pass' | 'warning' | 'failure';

interface CheckResult {
  name: string;
  status: CheckStatus;
  message: string;
}

const results: CheckResult[] = [];

const STATUS_ICON: Record<CheckStatus, string> = {
  pass: '✅ PASS',
  warning: '⚠ WARNING',
  failure: '❌ FAILURE',
};

function report(name: string, status: CheckStatus, message: string): void {
  results.push({ name, status, message });
  console.log(`  ${STATUS_ICON[status]} — ${name}: ${message}`);
}

function isPackageResolvable(packageName: string): boolean {
  try {
    require.resolve(packageName, { paths: [process.cwd()] });
    return true;
  } catch {
    return false;
  }
}

function isBrowserExecutableAvailable(executablePath: () => string): boolean {
  try {
    const executable = executablePath();
    return fs.existsSync(executable);
  } catch {
    return false;
  }
}

function main(): void {
  console.log(`\n${FRAMEWORK_NAME} v${FRAMEWORK_VERSION} — Health Check\n`);

  checkNodeVersion();
  checkPlaywrightPackage();
  checkPlaywrightBrowsers();
  checkEnvironmentConfig();
  checkRequiredFolders();
  checkAllureResultsFolder();
  checkRequiredFiles();
  checkAllureAvailability();
  checkDependencyHealth();

  const passed = results.filter((r) => r.status === 'pass').length;
  const warnings = results.filter((r) => r.status === 'warning').length;
  const failures = results.filter((r) => r.status === 'failure').length;

  console.log(`\n--- Summary ---`);
  console.log(`  ✅ Passed:   ${passed}`);
  console.log(`  ⚠ Warnings: ${warnings}`);
  console.log(`  ❌ Failed:   ${failures}`);

  if (failures > 0) {
    console.log(
      '\nFramework health check FAILED. Resolve failures above before execution.\n',
    );
    process.exit(1);
  }

  if (warnings > 0) {
    console.log(
      '\nFramework health check PASSED with warnings. Execution is ready.\n',
    );
    return;
  }

  console.log('\nFramework health check PASSED. Ready for execution.\n');
}

function checkNodeVersion(): void {
  const major = parseInt(process.version.slice(1).split('.')[0] ?? '0', 10);
  const ok = major >= MIN_NODE_VERSION;
  report(
    'Node.js version',
    ok ? 'pass' : 'failure',
    ok
      ? `${process.version} (minimum v${MIN_NODE_VERSION})`
      : `${process.version} — upgrade to Node.js v${MIN_NODE_VERSION}+`,
  );
}

function checkPlaywrightPackage(): void {
  if (isPackageResolvable('playwright')) {
    report('Playwright package', 'pass', 'Resolved from node_modules');
    return;
  }

  report('Playwright package', 'failure', 'Not installed — run npm install');
}

function checkPlaywrightBrowsers(): void {
  if (!isPackageResolvable('playwright')) {
    return;
  }

  const browsers = [
    { name: 'Chromium', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit', launcher: webkit },
  ] as const;

  const missing: string[] = [];
  const installed: string[] = [];

  for (const browser of browsers) {
    const available = isBrowserExecutableAvailable(() =>
      browser.launcher.executablePath(),
    );
    if (available) {
      installed.push(browser.name);
    } else {
      missing.push(browser.name);
    }
  }

  if (!installed.includes('Chromium')) {
    report(
      'Playwright browsers',
      'failure',
      'Chromium executable not found — run: npx playwright install chromium',
    );
    return;
  }

  if (missing.length > 0) {
    report(
      'Playwright browsers',
      'warning',
      `Chromium ready; optional browsers missing: ${missing.join(', ')} — run: npx playwright install`,
    );
    return;
  }

  report(
    'Playwright browsers',
    'pass',
    `Executables available: ${installed.join(', ')}`,
  );
}

function checkEnvironmentConfig(): void {
  try {
    loadEnvironmentFiles();
    const config = getEnvironmentConfig();
    const validEnv = Object.values(Environment).includes(config.environment);
    const validBrowser = Object.values(BrowserType).includes(config.browser);
    const ok = validEnv && validBrowser && !!config.baseUrl;

    report(
      'Environment config',
      ok ? 'pass' : 'failure',
      ok
        ? `ENV=${config.environment}, BROWSER=${config.browser}, URL=${config.baseUrl}`
        : 'Invalid ENV, BROWSER, or BASE_URL configuration',
    );
  } catch (error) {
    report(
      'Environment config',
      'failure',
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
    'src/reports',
  ];

  const missing = folders.filter(
    (folder) => !fs.existsSync(path.resolve(process.cwd(), folder)),
  );

  report(
    'Required folders',
    missing.length === 0 ? 'pass' : 'failure',
    missing.length === 0
      ? `${folders.length} framework folders present`
      : `Missing: ${missing.join(', ')}`,
  );
}

function checkAllureResultsFolder(): void {
  const resultsDir = path.resolve(process.cwd(), REPORT_PATHS.allureResults);

  if (fs.existsSync(resultsDir)) {
    report(
      'Allure results folder',
      'pass',
      `${REPORT_PATHS.allureResults} exists`,
    );
    return;
  }

  report(
    'Allure results folder',
    'warning',
    'Allure results folder has not been generated yet. It will be created automatically after the first report generation.',
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
    (file) => !fs.existsSync(path.resolve(process.cwd(), file)),
  );

  report(
    'Required files',
    missing.length === 0 ? 'pass' : 'failure',
    missing.length === 0
      ? `${files.length} framework files present`
      : `Missing: ${missing.join(', ')}`,
  );
}

function checkAllureAvailability(): void {
  if (!isPackageResolvable('allure-commandline')) {
    report(
      'Allure CLI',
      'warning',
      'allure-commandline package not found — run npm install (report generation unavailable)',
    );
    return;
  }

  const allureBin = path.resolve(process.cwd(), 'node_modules/.bin/allure');
  if (!fs.existsSync(allureBin)) {
    report(
      'Allure CLI',
      'warning',
      'Allure binary not found in node_modules/.bin — run npm install',
    );
    return;
  }

  try {
    const version = execFileSync(allureBin, ['--version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    report('Allure CLI', 'pass', `Available (${version})`);
  } catch {
    report(
      'Allure CLI',
      'warning',
      'Allure package installed but CLI did not respond — report generation may be unavailable',
    );
  }
}

function checkDependencyHealth(): void {
  const coreDependencies = [
    'playwright',
    'winston',
    '@cucumber/cucumber',
    '@playwright/test',
    'allure-cucumberjs',
  ];

  const missing = coreDependencies.filter((dep) => !isPackageResolvable(dep));

  if (missing.length > 0) {
    report(
      'Core dependencies',
      'failure',
      `Missing packages: ${missing.join(', ')} — run npm install`,
    );
    return;
  }

  report(
    'Core dependencies',
    'pass',
    `${coreDependencies.join(', ')} resolved`,
  );
}

main();
