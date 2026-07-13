export const REPORT_PATHS = {
  allureResults: 'src/reports/allure-results',
  allureReport: 'src/reports/allure-report',
  screenshots: 'src/reports/screenshots',
  videos: 'src/reports/videos',
  traces: 'src/reports/traces',
} as const;

export const REPORT_FILES = {
  environmentProperties: 'environment.properties',
  executorProperties: 'executor.properties',
  cucumberJson: 'src/reports/cucumber-report.json',
} as const;
