import { BeforeStep, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/world';
import { CucumberAttach } from '../interfaces';

BeforeStep(function (this: CustomWorld, step) {
  if (!this.applicationCreationAssertions) {
    return;
  }

  this.applicationCreationAssertions.setReportContext({
    attach: this.attach.bind(this) as CucumberAttach,
    scenarioName: this.scenarioName,
    stepName: step.pickleStep.text,
  });
});

When(
  'the user opens the Create New Application dialog',
  async function (this: CustomWorld) {
    await this.applicationCreationPage.openCreateApplicationDialog();
  },
);

When(
  'the user selects Alabama on the application creation dialog',
  async function (this: CustomWorld) {
    const selection = this.applicationCreationAssertions.getValidApplication();
    await this.applicationCreationPage.selectVerifiedState(selection);
  },
);

When(
  'the user selects Alabama and Term Life on the application creation dialog',
  async function (this: CustomWorld) {
    const selection = this.applicationCreationAssertions.getValidApplication();
    await this.applicationCreationPage.selectVerifiedStateAndProduct(selection);
  },
);

When(
  'the user selects Puerto Rico on the application creation dialog',
  async function (this: CustomWorld) {
    const selection =
      this.applicationCreationAssertions.getPuertoRicoIulApplication();
    await this.applicationCreationPage.selectState(
      selection.state,
      selection.stateCode,
    );
  },
);

When(
  'the user selects Guam on the application creation dialog',
  async function (this: CustomWorld) {
    const selection =
      this.applicationCreationAssertions.getGuamIulApplication();
    await this.applicationCreationPage.selectState(
      selection.state,
      selection.stateCode,
    );
  },
);

When(
  'the user opens the State dropdown on the application creation dialog',
  async function (this: CustomWorld) {
    await this.applicationCreationPage.openStateDropdown();
  },
);

When(
  'the user opens the Product dropdown on the application creation dialog',
  async function (this: CustomWorld) {
    await this.applicationCreationPage.openProductDropdown();
  },
);

When(
  'the user selects Alabama and Indexed Universal Life on the application creation dialog',
  async function (this: CustomWorld) {
    const selection =
      this.applicationCreationAssertions.getAlabamaIulApplication();
    await this.applicationCreationPage.selectStateAndProduct(
      selection.state,
      selection.stateCode,
      selection.product,
      selection.productCode,
    );
  },
);

When(
  'the user selects Puerto Rico and Indexed Universal Life on the application creation dialog',
  async function (this: CustomWorld) {
    const selection =
      this.applicationCreationAssertions.getPuertoRicoIulApplication();
    await this.applicationCreationPage.selectStateAndProduct(
      selection.state,
      selection.stateCode,
      selection.product,
      selection.productCode,
    );
  },
);

When(
  'the user selects Guam and Indexed Universal Life on the application creation dialog',
  async function (this: CustomWorld) {
    const selection =
      this.applicationCreationAssertions.getGuamIulApplication();
    await this.applicationCreationPage.selectStateAndProduct(
      selection.state,
      selection.stateCode,
      selection.product,
      selection.productCode,
    );
  },
);

When(
  'the user selects the verified Puerto Rico IUL application combination',
  async function (this: CustomWorld) {
    const selection =
      this.applicationCreationAssertions.getPuertoRicoIulApplication();
    await this.applicationCreationPage.selectApplicationCombination(selection);
  },
);

When(
  'the user selects the verified Guam IUL application combination',
  async function (this: CustomWorld) {
    const selection =
      this.applicationCreationAssertions.getGuamIulApplication();
    await this.applicationCreationPage.selectApplicationCombination(selection);
  },
);

When(
  'the user captures the available State dropdown options on the application creation dialog',
  async function (this: CustomWorld) {
    this.capturedStateDropdownOptions =
      await this.applicationCreationPage.getAvailableStateOptions();
  },
);

When(
  'the user selects the verified application creation combination',
  async function (this: CustomWorld) {
    const selection = this.applicationCreationAssertions.getValidApplication();
    await this.applicationCreationPage.selectVerifiedApplicationCombination(
      selection,
    );
  },
);

When('the user starts the application', async function (this: CustomWorld) {
  await this.applicationCreationPage.startApplication();
});

When(
  'the user cancels application creation',
  async function (this: CustomWorld) {
    await this.applicationCreationPage.cancelApplication();
  },
);

When(
  'the user closes the Create New Application dialog',
  async function (this: CustomWorld) {
    await this.applicationCreationPage.closeApplicationDialog();
  },
);

When(
  'the user returns to the Applications page',
  async function (this: CustomWorld) {
    await this.applicationCreationPage.returnToApplications();
  },
);

When(
  'the user records the visible dashboard application identifiers',
  async function (this: CustomWorld) {
    this.dashboardApplicationIdsBefore =
      await this.applicationCreationAssertions.captureVisibleDashboardApplicationIds();
  },
);

Then(
  'the Create New Application dialog should be displayed',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyCreationDialogVisible();
  },
);

Then(
  'the Create New Application button should be visible and enabled',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyCreateNewApplicationButtonVisibleAndEnabled();
  },
);

Then(
  'the Applications page should be displayed',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyApplicationsPageDisplayed();
  },
);

Then(
  'the Product field should be disabled before state selection',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyProductDisabledBeforeStateSelection();
  },
);

Then(
  'the Template field should be hidden before product selection',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyTemplateHiddenBeforeProductSelection();
  },
);

Then(
  'the Start Application button should be disabled before required selections',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyStartApplicationDisabledBeforeRequiredSelections();
  },
);

Then(
  'Alabama should be selected on the application creation dialog',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyStateSelected();
  },
);

Then(
  'the Product field should be enabled after state selection',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyProductEnabledAfterStateSelection();
  },
);

Then(
  'the Template field should be visible after product selection',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyTemplateVisibleAfterProductSelection();
  },
);

Then(
  'the Template field should be enabled after product selection',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyTemplateEnabledAfterProductSelection();
  },
);

Then('the Template value should be Life', async function (this: CustomWorld) {
  await this.applicationCreationAssertions.verifyTemplateValueIsLife();
});

Then(
  'the application creation should complete successfully',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyApplicationCreationCompleted();
  },
);

Then(
  'the application form shell should be displayed',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyApplicationFormShellDisplayed();
  },
);

Then(
  'a new verified application record should appear on the dashboard',
  async function (this: CustomWorld) {
    const previousApplicationIds = this.dashboardApplicationIdsBefore ?? [];
    await this.applicationCreationAssertions.verifyNewVerifiedApplicationRecordAppeared(
      previousApplicationIds,
    );
  },
);

Then(
  'Indexed Universal Life should be available in the Product dropdown',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyIndexedUniversalLifeAvailable();
  },
);

Then(
  'Term Life should be available in the Product dropdown',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyTermLifeAvailable();
  },
);

Then(
  'Term Life should not be available in the Product dropdown',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyTermLifeNotAvailable();
  },
);

Then(
  'the verified IUL template value should be displayed',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyIulTemplateValue();
  },
);

Then(
  'New York should not be available in the State dropdown',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyNewYorkNotAvailable();
  },
);

Then(
  'U.S. Virgin Islands should not be available in the State dropdown',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyUsVirginIslandsNotAvailable();
  },
);

Then(
  'the Start Application button should be enabled after valid selections',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyStartApplicationEnabledAfterValidSelections();
  },
);

Then(
  'the State dropdown should display the expected number of available locations',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.assertStateOptionCount();
  },
);

Then(
  'the State dropdown should contain all expected available locations',
  async function (this: CustomWorld) {
    const actualLocations = this.capturedStateDropdownOptions ?? [];
    await this.applicationCreationAssertions.assertStateOptionsMatchExpected(
      actualLocations,
    );
  },
);

Then(
  'the Create New Application dialog should be closed',
  async function (this: CustomWorld) {
    await this.applicationCreationAssertions.verifyCreationDialogClosed();
  },
);
