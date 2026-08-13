import { Page } from 'playwright';

/**
 * Term Life Application Form — Licensing module locators.
 */
export class LicensingLocators {
  constructor(private readonly page: Page) {}

  get licensingSectionLink() {
    return this.page
      .getByTestId('agp-section-list')
      .getByRole('link', { name: /^Licensing$/i });
  }

  get agentInformationHeading() {
    return this.page.getByRole('heading', { name: /^Agent Information$/i });
  }

  get agentAddressHeading() {
    return this.page.getByRole('heading', { name: /^Agent Address$/i });
  }

  get returnToApplicationsButton() {
    return this.page.getByTestId('agp-form-button-back');
  }

  get primaryNextButton() {
    return this.page.getByTestId('agp-form-action-1');
  }

  get previousButton() {
    return this.page.getByTestId('agp-form-incomplete-button-prev');
  }

  get splitAgentCardListRoot() {
    return this.page.getByTestId('agp-form-field-cardlist-41022');
  }

  get splitAgentAddButton() {
    return this.page.getByTestId('agp-form-field-cardlist-41022-add');
  }

  get splitAgentModal() {
    return this.page.getByTestId('agp-form-field-cardlist-41022-modal');
  }

  get splitAgentModalSaveButton() {
    return this.page.getByTestId('agp-form-field-cardlist-41022-modal-save');
  }

  get splitAgentModalCancelButton() {
    return this.page.getByTestId('agp-form-field-cardlist-41022-modal-cancel');
  }

  get splitAgentDeleteConfirmButton() {
    return this.page.getByTestId(
      'agp-form-field-cardlist-41022-delete-confirm-confirm',
    );
  }

  splitAgentEditButton(index: number) {
    return this.page.getByTestId(
      `agp-form-field-cardlist-41022-item-${index}-edit`,
    );
  }

  splitAgentRemoveButton(index: number) {
    return this.splitAgentCardListRoot.getByTestId(
      `agp-form-field-cardlist-41022-item-${index}-remove`,
    );
  }

  splitAgentRowEditButtons() {
    return this.splitAgentCardListRoot.locator(
      '[data-testid^="agp-form-field-cardlist-41022-item-"][data-testid$="-edit"]',
    );
  }

  splitAgentModalField(suffix: string) {
    return this.splitAgentModal.locator(`[data-testid$="${suffix}"]`);
  }

  fieldInput(fieldType: string, fieldId: string) {
    return this.page.getByTestId(
      `agp-form-field-${fieldType}-${fieldId}-input`,
    );
  }

  fieldLabel(fieldType: string, fieldId: string) {
    return this.page.getByTestId(
      `agp-form-field-${fieldType}-${fieldId}-label`,
    );
  }

  fieldError(fieldType: string, fieldId: string) {
    return this.page.locator(
      `[data-testid="agp-form-field-${fieldType}-${fieldId}-error"], [data-testid="agp-form-field-${fieldType}-${fieldId}"] [role="alert"]`,
    );
  }

  radioswitchOption(fieldId: string, option: 'yes' | 'no') {
    return this.page.getByTestId(
      `agp-form-field-radioswitch-${fieldId}-option-${option}`,
    );
  }

  additionalAgentsCardList(fieldId: string) {
    return this.page.locator(
      `[data-testid^="agp-form-field-cardlist-${fieldId}"], [data-testid*="cardlist-${fieldId}"]`,
    );
  }

  get addressLine1Label() {
    return this.page.getByText(/Address Line 1/i).first();
  }

  get proposedPrimaryInsuredSectionLink() {
    return this.page
      .getByTestId('agp-section-list')
      .getByRole('link', { name: /Proposed Primary Insured/i })
      .first();
  }

  get incompleteCounter() {
    return this.page.getByTestId('agp-form-incomplete-counter');
  }
}
