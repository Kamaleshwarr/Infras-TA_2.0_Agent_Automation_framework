import { Page } from 'playwright';

export class ProposedPrimaryInsuredPage1Locators {
  constructor(private readonly page: Page) {}

  get moduleHeading() {
    return this.page.getByText(/^Proposed Primary Insured Details$/i).first();
  }

  get page1Indicator() {
    return this.page.getByText(
      /Proposed Primary Insured Details.*Page 1 of 2/i,
    );
  }

  // Page 2 does not render a "Page 2 of 2" caption in every state, so the
  // citizenship question that opens Page 2 is used as an equivalent marker.
  get page2Indicator() {
    return this.page
      .getByText(/Page 2 of 2/i)
      .or(this.citizenshipQuestion)
      .first();
  }

  get citizenshipQuestion() {
    return this.page.getByText(/^Are you a U\.S\. citizen\?/i);
  }

  get proposedPrimaryInsuredSection() {
    return this.page.getByTestId('agp-section-item-proposed-primary-insured');
  }

  get proposedPrimaryInsuredSectionLink() {
    return this.page.getByTestId(
      'agp-section-item-proposed-primary-insured-link',
    );
  }

  get proposedPrimaryInsuredToggle() {
    return this.page.getByTestId(
      'agp-section-item-proposed-primary-insured-toggle',
    );
  }

  get proposedPrimaryInsuredChildList() {
    return this.page.getByTestId(
      'agp-section-sub-proposed-primary-insured-list',
    );
  }

  get proposedPrimaryInsuredDetailsLink() {
    return this.page.getByTestId(
      'agp-section-sub-proposed-primary-insured-5344-link',
    );
  }

  get proposedPrimaryInsuredDetailsItem() {
    return this.page.getByTestId(
      'agp-section-sub-proposed-primary-insured-5344',
    );
  }

  get militaryLink() {
    return this.page.getByTestId(
      'agp-section-sub-proposed-primary-insured-5347-link',
    );
  }

  get militaryPageIndicator() {
    return this.page.getByText(/Military.*Page 1 of 1/i);
  }

  get personalInformationGroup() {
    return this.page.getByText(
      /^Proposed Primary Insured Personal Information$/i,
    );
  }

  get physicalAddressGroup() {
    return this.page.getByText(
      /^Physical Residential Address \(Cannot be a P\.O\. Box\)$/i,
    );
  }

  get mailingSameQuestion() {
    return this.page.getByText(
      /^Is U\.S\. Mailing Address same as Physical Residential Address\?/i,
    );
  }

  get mailingAddressLabel() {
    return this.page.getByText(/^U\.S\. Mailing Address/i).first();
  }

  get nextButton() {
    return this.page.getByTestId('agp-form-action-1');
  }

  get backButton() {
    return this.page.getByRole('button', { name: /^Back$/i });
  }

  fieldInput(type: string, fieldId: string) {
    return this.page.getByTestId(`agp-form-field-${type}-${fieldId}-input`);
  }

  dropdownTrigger(fieldId: string) {
    return this.page.getByTestId(`agp-form-field-dropdown-${fieldId}-trigger`);
  }

  fieldContainer(type: string, fieldId: string) {
    return this.page.getByTestId(`agp-form-field-${type}-${fieldId}`);
  }

  dropdownOption(optionLabel: string) {
    return this.page.getByRole('option', {
      name: new RegExp(`^${this.escapeRegExp(optionLabel)}$`, 'i'),
    });
  }

  fieldError(type: string, fieldId: string) {
    return this.page.locator(
      `[data-testid="agp-form-field-${type}-${fieldId}-error"], ` +
        `[data-testid="agp-form-field-${type}-${fieldId}"] [role="alert"], ` +
        `[data-testid="agp-form-field-${type}-${fieldId}"] .MuiFormHelperText-root.Mui-error`,
    );
  }

  radioOption(fieldId: string, option: 'yes' | 'no') {
    return this.page.getByTestId(
      `agp-form-field-radiobutton-${fieldId}-option-${option}`,
    );
  }

  radioInput(fieldId: string, option: 'yes' | 'no') {
    return this.page.getByTestId(
      `agp-form-field-radiobutton-${fieldId}-option-${option}-input`,
    );
  }

  get physicalAddressInputByLabel() {
    return this.textFieldByLabel(/^Physical Residential Address/i)
      .locator('[data-testid$="-input"]')
      .first();
  }

  get foreignStateInput() {
    return this.fieldByLabel(/^State \/ Territory$/i).locator(
      '[data-testid$="-input"]',
    );
  }

  get foreignPostalCodeInput() {
    return this.fieldByLabel(/^Postal Code$/i).locator(
      '[data-testid$="-input"]',
    );
  }

  get openListbox() {
    return this.page.getByRole('listbox');
  }

  get googlePlacesSuggestionContainer() {
    return this.page.locator('.pac-container:visible');
  }

  get googlePlacesSuggestionItems() {
    return this.page.locator('.pac-item:visible');
  }

  get addressSuggestions() {
    return this.googlePlacesSuggestionContainer.or(this.openListbox);
  }

  get addressSuggestionOptions() {
    return this.googlePlacesSuggestionItems.or(this.page.getByRole('option'));
  }

  get noOptionsMessage() {
    return this.page.getByText(/^No options$/i);
  }

  get visibleDropdownOptions() {
    return this.page.getByRole('option');
  }

  get datePickerPopover() {
    return this.page.locator(
      '.react-datepicker-popper, .react-datepicker__portal',
    );
  }

  get datePickerSelectableDay() {
    return this.page
      .locator(
        '.react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)',
      )
      .first();
  }

  private fieldByLabel(label: RegExp) {
    return this.page.locator('[data-testid^="agp-form-field-"]').filter({
      has: this.page
        .locator('[data-testid$="-label"]')
        .filter({ hasText: label }),
    });
  }

  // Restricted to text fields so the mailing-same-as-physical radio question,
  // whose label repeats "Physical Residential Address", is never matched.
  private textFieldByLabel(label: RegExp) {
    return this.page.locator('[data-testid^="agp-form-field-text-"]').filter({
      has: this.page
        .locator('[data-testid$="-label"]')
        .filter({ hasText: label }),
    });
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
