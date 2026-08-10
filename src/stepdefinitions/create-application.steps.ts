import { Then, When } from '@cucumber/cucumber';
import { TestDataProvider } from '../testdata/providers/TestDataProvider';
import { CustomWorld } from '../hooks/world';
import { WizardPageOneData } from '../pages/ApplicationWizardPage';

interface CreateApplicationTestData {
  wizardPageOne: WizardPageOneData & { stepIndicatorText: string };
  prefilledAgentNumber: string;
}

const createApplicationData =
  TestDataProvider.loadJson<CreateApplicationTestData>(
    'create-application.json',
  );

When(
  'the user clicks Create New Application on the dashboard',
  async function (this: CustomWorld) {
    await this.dashboardPage.clickCreateNewApplication();
  },
);

When(
  'the user fills Application Wizard page one with valid data',
  async function (this: CustomWorld) {
    await this.applicationWizardPage.fillWizardPageOne(
      createApplicationData.wizardPageOne,
    );
  },
);

Then(
  'the Application Wizard page one should be displayed',
  async function (this: CustomWorld) {
    await this.applicationWizardPage.verifyWizardPageOneDisplayed();
  },
);

Then(
  'the wizard should show step indicator {string}',
  async function (this: CustomWorld, expectedText: string) {
    await this.applicationWizardPage.verifyWizardStepIndicator(expectedText);
  },
);

Then(
  'the Application Wizard page one should display prefilled agent details',
  async function (this: CustomWorld) {
    await this.applicationWizardPage.verifyWizardPageOneDisplayed();
    await this.applicationWizardPage.verifyWizardPageOnePrefilledAgentNumber(
      createApplicationData.prefilledAgentNumber,
    );
  },
);
