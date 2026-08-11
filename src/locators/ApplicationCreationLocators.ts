import { Page } from 'playwright';

/**
 * Application Creation dialog locators — QA Agent Portal dashboard modal.
 * Target: agent-portal-qa-20.ilifeta.com
 */
export class ApplicationCreationLocators {
  constructor(private readonly page: Page) {}

  get createNewApplicationButton() {
    return this.page.getByTestId('agp-dashboard-button-create');
  }

  get dialogHeading() {
    return this.page.getByRole('heading', {
      name: /^Create New Application$/i,
    });
  }

  get stateTrigger() {
    return this.page.getByTestId(
      'agp-dashboard-dialog-create-field-state-trigger',
    );
  }

  get productTrigger() {
    return this.page.getByTestId(
      'agp-dashboard-dialog-create-field-product-trigger',
    );
  }

  get templateTrigger() {
    return this.page.getByTestId(
      'agp-dashboard-dialog-create-field-template-trigger',
    );
  }

  get startApplicationButton() {
    return this.page.getByTestId('agp-dashboard-dialog-create-button-submit');
  }

  get cancelButton() {
    return this.page.getByTestId('agp-dashboard-dialog-create-button-cancel');
  }

  get closeButton() {
    return this.page.getByRole('button', { name: /^Close$/i });
  }

  get alabamaOption() {
    return this.page.getByTestId(
      'agp-dashboard-dialog-create-field-state-option-al',
    );
  }

  get termLifeOption() {
    return this.page.getByTestId(
      'agp-dashboard-dialog-create-field-product-option-term-life',
    );
  }

  get indexedUniversalLifeOption() {
    return this.page.getByTestId(
      'agp-dashboard-dialog-create-field-product-option-indexed-universal-life',
    );
  }

  get lifeTemplateOption() {
    return this.page.getByTestId(
      'agp-dashboard-dialog-create-field-template-option-3107',
    );
  }

  get applicationSectionsHeading() {
    return this.page.getByRole('heading', { name: /^Application Sections$/i });
  }

  get returnToApplicationsLink() {
    return this.page.getByText(/return to applications/i).first();
  }

  get applicationsPageHeading() {
    return this.page.getByRole('heading', { name: /^Applications$/i });
  }

  get applicationsListPaginationStatus() {
    return this.page.getByText(/Showing page \d+ of \d+/i);
  }

  get dashboardApplicationCardActionTriggers() {
    return this.page.locator(
      '[data-testid^="agp-dashboard-card-"][data-testid$="-actions-trigger"]',
    );
  }

  applicationRecordRow(applicationId: string) {
    return this.page.getByRole('row').filter({ hasText: applicationId });
  }

  get stateDropdownOptions() {
    return this.page.locator(
      '[data-testid^="agp-dashboard-dialog-create-field-state-option-"]',
    );
  }

  stateOption(stateCode: string) {
    return this.page.getByTestId(
      `agp-dashboard-dialog-create-field-state-option-${stateCode}`,
    );
  }

  productOption(productCode: string) {
    return this.page.getByTestId(
      `agp-dashboard-dialog-create-field-product-option-${productCode}`,
    );
  }

  templateOption(templateCode: string) {
    return this.page.getByTestId(
      `agp-dashboard-dialog-create-field-template-option-${templateCode}`,
    );
  }
}
