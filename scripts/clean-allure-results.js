#!/usr/bin/env node
/**
 * Removes and recreates the Allure raw results directory before a test run.
 * Uses framework path constants — does not touch cucumber-report.json,
 * screenshots, videos, or traces.
 */
require('ts-node/register');

const fs = require('fs');
const path = require('path');
const { REPORT_PATHS } = require('../src/constants/PathConstants');

function cleanAllureResults() {
  const resultsDir = path.resolve(process.cwd(), REPORT_PATHS.allureResults);

  if (fs.existsSync(resultsDir)) {
    fs.rmSync(resultsDir, { recursive: true, force: true });
  }

  fs.mkdirSync(resultsDir, { recursive: true });
}

module.exports = { cleanAllureResults };
