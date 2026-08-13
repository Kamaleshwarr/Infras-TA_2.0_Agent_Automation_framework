import {
  Before,
  BeforeStep,
  Given,
  Then,
  When,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { getEnvironmentConfig } from '../config/environment.config';
import { CustomWorld } from '../hooks/world';
import { CucumberAttach } from '../interfaces';
import { LicensingFlowResolver } from '../utils/licensing/LicensingFlowResolver';

const LICENSING_STEP_TIMEOUT_MS = getEnvironmentConfig().timeout * 4;

setDefaultTimeout(LICENSING_STEP_TIMEOUT_MS);

/** login.steps.ts loads later alphabetically and resets the global timeout to 60s. */
Before({ tags: '@licensing' }, function () {
  setDefaultTimeout(LICENSING_STEP_TIMEOUT_MS);
});

BeforeStep(function (this: CustomWorld, step) {
  if (!this.licensingAssertions) {
    return;
  }

  this.licensingAssertions.setReportContext({
    attach: this.attach.bind(this) as CucumberAttach,
    scenarioName: this.scenarioName,
    stepName: step.pickleStep.text,
  });
});

Given(
  'the user creates a Term Life application for state {string}',
  async function (this: CustomWorld, stateName: string) {
    this.licensingAssertions.setApplicationStateName(stateName);
    const selection = LicensingFlowResolver.buildTermLifeSelection(stateName);
    await this.applicationCreationPage.openCreateApplicationDialog();
    await this.applicationCreationPage.selectApplicationCombination(selection);
    await this.applicationCreationPage.startApplication();
    await this.licensingPage.waitForLicensingModuleReady();
  },
);

When(
  'the user navigates to the Licensing module',
  async function (this: CustomWorld) {
    await this.licensingPage.navigateToLicensingModule();
  },
);

Then(
  'the complete Flow A Licensing coverage should pass',
  { timeout: LICENSING_STEP_TIMEOUT_MS },
  async function (this: CustomWorld) {
    await this.licensingAssertions.executeCompleteFlowCoverage('Alabama');
  },
);

Then(
  'the complete Flow B Licensing coverage should pass',
  { timeout: LICENSING_STEP_TIMEOUT_MS },
  async function (this: CustomWorld) {
    await this.licensingAssertions.executeCompleteFlowCoverage('California');
  },
);

Then(
  'the complete Flow C Licensing coverage should pass',
  { timeout: LICENSING_STEP_TIMEOUT_MS },
  async function (this: CustomWorld) {
    await this.licensingAssertions.executeCompleteFlowCoverage('Delaware');
  },
);

Then(
  'the complete Flow D Licensing coverage should pass',
  { timeout: LICENSING_STEP_TIMEOUT_MS },
  async function (this: CustomWorld) {
    await this.licensingAssertions.executeCompleteFlowCoverage('Missouri');
  },
);
