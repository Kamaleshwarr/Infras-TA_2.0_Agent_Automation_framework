require('dotenv').config();

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
  },
};
