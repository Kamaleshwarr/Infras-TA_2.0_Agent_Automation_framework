import {
  Before,
  Given,
  Then,
  When,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { getEnvironmentConfig } from '../config/environment.config';
import { CustomWorld } from '../hooks/world';
import { PiPage1ExecutionContext } from '../utils/proposed-primary-insured/PiPage1ExecutionContext';
import { LicensingFlowResolver } from '../utils/licensing/LicensingFlowResolver';
import {
  applyPendingAllureHierarchyOnce,
  applyPiPage1SelectedStateSubSuite,
} from '../utils/report/allureHierarchy';
const PI_PAGE1_COVERAGE_TIMEOUT_MS = 1_200_000;

setDefaultTimeout(getEnvironmentConfig().timeout);

Before({ tags: '@proposed-primary-insured-page1' }, function () {
  setDefaultTimeout(PI_PAGE1_COVERAGE_TIMEOUT_MS);
});

Given(
  'the user starts a Term Life application for Proposed Primary Insured Page 1 for {string}',
  async function (this: CustomWorld, stateName: string) {
    this.piPage1ExecutionContext = PiPage1ExecutionContext.create(stateName);
    this.proposedPrimaryInsuredPage1Page.configureForState(
      this.piPage1ExecutionContext.stateName,
    );
    this.proposedPrimaryInsuredPage1Assertions.setExecutionContext(
      this.piPage1ExecutionContext,
    );
    await applyPendingAllureHierarchyOnce();
    await applyPiPage1SelectedStateSubSuite(
      this.piPage1ExecutionContext.stateName,
    );

    const selection = LicensingFlowResolver.buildTermLifeSelection(
      this.piPage1ExecutionContext.stateName,
    );
    await this.applicationCreationPage.openCreateApplicationDialog();
    await this.applicationCreationPage.selectApplicationCombination(selection);
    await this.applicationCreationPage.startApplication();
    await this.licensingPage.waitForLicensingModuleReady();
  },
);

When(
  'the user completes Licensing and opens Proposed Primary Insured Page 1',
  async function (this: CustomWorld) {
    const stateName = this.requirePiPage1ApplicationState();
    const flowId = LicensingFlowResolver.resolveFlow(stateName);
    const profile = LicensingFlowResolver.getFlowProfile(flowId);
    await this.licensingPage.fillCompleteValidLicensing(
      profile.licenseNumberPresent,
      profile.agentAddressPresent,
      stateName,
    );
    await this.licensingPage.clickPrimaryNext();
    await this.proposedPrimaryInsuredPage1Page.waitForReady();
  },
);

Then(
  'Proposed Primary Insured Page 1 coverage should pass',
  { timeout: PI_PAGE1_COVERAGE_TIMEOUT_MS },
  async function (this: CustomWorld) {
    await this.proposedPrimaryInsuredPage1Assertions.executeCoverage();
  },
);
