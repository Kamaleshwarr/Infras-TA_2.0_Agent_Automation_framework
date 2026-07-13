#!/usr/bin/env node
/**
 * Runs the test suite across all supported browsers sequentially.
 * Usage: npm run test:cross-browser
 */
const { spawnSync } = require('child_process');

const browsers = ['chromium', 'firefox', 'webkit'];
let failed = false;

for (const browser of browsers) {
  process.stdout.write(`\n=== Running tests on ${browser} ===\n\n`);
  const result = spawnSync('npx', ['cucumber-js'], {
    stdio: 'inherit',
    env: { ...process.env, BROWSER: browser, WORKERS: '1' },
    shell: true,
  });

  if (result.status !== 0) {
    failed = true;
    process.stderr.write(`\nBrowser ${browser} failed.\n`);
  }
}

process.exit(failed ? 1 : 0);
