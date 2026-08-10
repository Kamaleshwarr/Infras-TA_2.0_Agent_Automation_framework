#!/usr/bin/env node
/**
 * Cross-platform Cucumber entry point.
 * Cleans Allure raw results once, then forwards all CLI args to cucumber-js.
 */
const { spawnSync } = require('child_process');
const { cleanAllureResults } = require('./clean-allure-results');

cleanAllureResults();

const cucumberArgs = process.argv.slice(2);

const result = spawnSync('npx', ['cucumber-js', ...cucumberArgs], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
