import { CucumberAttach } from './IReportManager';

export type AssertionResultStatus = 'PASS' | 'FAIL';

export interface AssertionReportPayload {
  assertionName: string;
  expected: string;
  actual: string;
  result: AssertionResultStatus;
  scenarioName?: string;
  stepName?: string;
  context?: string;
}

export interface AssertionReportContext {
  attach?: CucumberAttach;
  scenarioName?: string;
  stepName?: string;
}
