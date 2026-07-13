/**
 * Deployment environments.
 * Configure via ENV environment variable.
 */
export enum Environment {
  DEV = 'DEV',
  QA = 'QA',
  UAT = 'UAT',
  PROD = 'PROD',
}

export const DEFAULT_ENVIRONMENT = Environment.QA;
