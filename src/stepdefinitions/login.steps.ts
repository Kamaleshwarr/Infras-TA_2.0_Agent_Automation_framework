import {
  BeforeStep,
  Given,
  Then,
  When,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { getEnvironmentConfig } from '../config/environment.config';
import { CucumberAttach } from '../interfaces';
import { CustomWorld } from '../hooks/world';
import { getAgentCredentials } from '../testdata/providers/agentCredentials';

setDefaultTimeout(getEnvironmentConfig().timeout);

BeforeStep(function (this: CustomWorld, step) {
  if (!this.loginAssertions) {
    return;
  }

  this.loginAssertions.setReportContext({
    attach: this.attach.bind(this) as CucumberAttach,
    scenarioName: this.scenarioName,
    stepName: step.pickleStep.text,
  });
});

Given('the login page is loaded', async function (this: CustomWorld) {
  await this.loginPage.openLoginPage();
  await this.loginAssertions.verifyLoginPageLoaded();
});

Given(
  'the user is logged in to the agent portal',
  async function (this: CustomWorld) {
    await this.loginPage.openLoginPage();
    await this.loginPage.login(getAgentCredentials());
    await this.loginAssertions.verifySuccessfulLogin();
  },
);

When(
  'the user logs in with valid credentials',
  async function (this: CustomWorld) {
    await this.loginPage.login(getAgentCredentials());
  },
);

When(
  'the user submits login for validation case {string}',
  async function (this: CustomWorld, caseId: string) {
    const validationCase = this.loginAssertions.getValidationCase(caseId);
    await this.loginPage.loginWith(
      validationCase.email,
      validationCase.password,
    );
  },
);

When(
  'the user opens the forgot password dialog',
  async function (this: CustomWorld) {
    await this.loginPage.navigateToForgotPassword();
  },
);

When(
  'the user closes the forgot password dialog with Cancel',
  async function (this: CustomWorld) {
    await this.loginPage.closeForgotPasswordWithCancel();
  },
);

When(
  'the user closes the forgot password dialog with Close',
  async function (this: CustomWorld) {
    await this.loginPage.closeForgotPasswordWithClose();
  },
);

Then(
  'the user should be successfully logged in',
  async function (this: CustomWorld) {
    await this.loginAssertions.verifySuccessfulLogin();
  },
);

Then(
  'login validation case {string} should display expected messages',
  async function (this: CustomWorld, caseId: string) {
    await this.loginAssertions.verifyValidationCase(caseId);
  },
);

Then(
  'the forgot password dialog should be displayed',
  async function (this: CustomWorld) {
    await this.loginAssertions.verifyForgotPasswordDialog();
  },
);

Then('the login page should be displayed', async function (this: CustomWorld) {
  await this.loginAssertions.verifyLoginPageLoaded();
});
