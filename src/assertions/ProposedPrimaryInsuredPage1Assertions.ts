import { expect, Locator, Page } from '@playwright/test';
import { dependencies } from '../core/DependencyRegistry';
import { CucumberAttach } from '../interfaces';
import { ProposedPrimaryInsuredPage1Page } from '../pages/ProposedPrimaryInsuredPage1Page';
import { PiPage1Field } from '../utils/proposed-primary-insured/ProposedPrimaryInsuredPage1Data';
import { PiPage1ExecutionContext } from '../utils/proposed-primary-insured/PiPage1ExecutionContext';
import {
  PI_PAGE1_VALIDATIONS,
  PiPage1ValidationId,
  PiPage1ValidationMatrix,
  suffixOptionValidationId,
} from '../utils/proposed-primary-insured/PiPage1ValidationMatrix';

type ActualDescription = string | (() => Promise<string>);

const PAGE_1 = 'Proposed Primary Insured Page 1';

export class ProposedPrimaryInsuredPage1Assertions {
  private readonly logger = dependencies.createLogger(
    'ProposedPrimaryInsuredPage1Assertions',
  );
  private readonly locators;
  private data!: ReturnType<ProposedPrimaryInsuredPage1Page['getData']>;
  private readonly matrix = new PiPage1ValidationMatrix();
  private readonly failures: string[] = [];
  private executionContext: PiPage1ExecutionContext | null = null;

  constructor(
    private readonly page: Page,
    private readonly attach: CucumberAttach,
    private readonly piPage: ProposedPrimaryInsuredPage1Page,
  ) {
    this.locators = piPage.getLocators();
  }

  setExecutionContext(context: PiPage1ExecutionContext): void {
    this.executionContext = context;
    this.data = this.piPage.getData();
  }

  async executeCoverage(): Promise<void> {
    if (!this.executionContext) {
      throw new Error(
        'Proposed Primary Insured Page 1 execution context is not set. Use the Given step that selects the application state.',
      );
    }

    this.data = this.piPage.getData();
    this.failures.length = 0;
    this.matrix.reset();

    try {
      await this.assertLeftNavigation();
      await this.assertPageStructure();
      await this.assertPageGroups();
      await this.assertUsaDefaults();
      await this.assertRequiredFields();
      await this.assertPersonalInformationRules();
      await this.assertSuffixOptions();
      await this.assertSuffixBehavior();
      await this.assertDobCalculatesAge();
      await this.assertDateOfBirthRules();
      await this.assertCountryDropdownRules();
      await this.assertCountryReflexiveFields();
      await this.assertOtherCountryRules();
      await this.assertPhysicalAddressRules();
      await this.assertApartmentAndPhysicalCityRules();
      await this.assertPhysicalStateRules();
      await this.assertPhysicalZipRules();
      await this.assertMailingQuestionRules();
      await this.assertMailingBehavior();
      await this.assertMailingAddressRules();
      await this.assertOptionalFieldsDoNotBlockNavigation();
      await this.assertValidNavigationAndPersistence();
    } finally {
      await this.matrix.attach(
        this.attach,
        this.executionContext.flowLabel,
        this.executionContext.matrixTitle,
      );
    }

    if (this.failures.length > 0) {
      throw new Error(
        `${this.executionContext.stateName} Proposed Primary Insured Page 1 completed with ${this.failures.length} product validation failure(s):\n${this.failures.join('\n')}`,
      );
    }
  }

  private async assertLeftNavigation(): Promise<void> {
    await this.checkVisible(
      'nav-section-available',
      this.locators.proposedPrimaryInsuredSectionLink,
      'The Proposed Primary Insured section link',
    );
    await this.evaluate(
      'nav-section-clickable',
      async () => {
        await expect(
          this.locators.proposedPrimaryInsuredSectionLink,
        ).toBeEnabled();
        await this.locators.proposedPrimaryInsuredSectionLink.click();
        await expect(this.locators.page1Indicator).toBeVisible();
      },
      {
        onPass:
          'The Proposed Primary Insured section link was enabled, accepted a click, and kept the user in the Proposed Primary Insured module.',
        onFail:
          'The Proposed Primary Insured section link was unavailable, disabled, or did not open its module.',
      },
    );

    if (await this.locators.proposedPrimaryInsuredToggle.isVisible()) {
      const expanded =
        (await this.locators.proposedPrimaryInsuredToggle.getAttribute(
          'aria-expanded',
        )) === 'true';
      if (expanded) {
        await this.piPage.toggleProposedPrimaryInsuredSection();
      }
      await this.piPage.toggleProposedPrimaryInsuredSection();
      await this.evaluate(
        'nav-section-expandable',
        () =>
          expect(this.locators.proposedPrimaryInsuredToggle).toHaveAttribute(
            'aria-expanded',
            'true',
          ),
        {
          onPass:
            'The available expand control opened the Proposed Primary Insured child navigation.',
          onFail:
            'The Proposed Primary Insured child navigation did not expand after its expand control was clicked.',
        },
      );
    } else {
      this.matrix.markNotApplicable(
        'nav-section-expandable',
        'The application UI did not render an expand/down-arrow control for Proposed Primary Insured, so expand-control behavior was not applicable.',
      );
    }

    await this.checkVisible(
      'nav-details-child-visible',
      this.locators.proposedPrimaryInsuredDetailsLink,
      'The Proposed Primary Insured Details child navigation item',
      'the Proposed Primary Insured section was expanded',
    );
    await this.checkVisible(
      'nav-military-child-visible',
      this.locators.militaryLink,
      'The Military child navigation item',
      'the Proposed Primary Insured section was expanded',
    );

    await this.evaluate(
      'nav-details-opens-page1',
      async () => {
        await this.piPage.openProposedPrimaryInsuredDetails();
        await expect(this.locators.page1Indicator).toBeVisible();
      },
      {
        onPass:
          'Clicking Proposed Primary Insured Details displayed Proposed Primary Insured Details - Page 1 of 2.',
        onFail:
          'Clicking Proposed Primary Insured Details did not display Proposed Primary Insured Details - Page 1 of 2.',
      },
    );
    await this.evaluate(
      'nav-military-opens-page1',
      async () => {
        await this.piPage.openMilitary();
        await expect(this.locators.militaryPageIndicator).toBeVisible();
      },
      {
        onPass: 'Clicking Military displayed Military - Page 1 of 1.',
        onFail: 'Clicking Military did not display Military - Page 1 of 1.',
      },
    );
    await this.piPage.openProposedPrimaryInsuredDetails();
  }

  private async assertPageGroups(): Promise<void> {
    await this.checkVisible(
      'personal-information-group',
      this.locators.personalInformationGroup,
      'The Proposed Primary Insured Personal Information group',
    );
    await this.checkVisible(
      'physical-address-group',
      this.locators.physicalAddressGroup,
      'The Physical Residential Address (Cannot be a P.O. Box) group',
    );
  }

  private async assertPageStructure(): Promise<void> {
    await this.checkVisible(
      'page-heading',
      this.locators.moduleHeading,
      'The "Proposed Primary Insured Details" heading',
    );
    await this.checkVisible(
      'page-indicator',
      this.locators.page1Indicator,
      'The "Page 1 of 2" indicator',
    );
    await this.checkVisible(
      'mailing-question',
      this.locators.mailingSameQuestion,
      'The mailing-address-same-as-physical question',
    );

    const fields = this.data.fields;
    const structureFields: ReadonlyArray<{
      id: PiPage1ValidationId;
      field: PiPage1Field;
    }> = [
      { id: 'field-legal-first-name', field: fields.legalFirstName },
      { id: 'field-middle-name', field: fields.middleName },
      { id: 'field-legal-last-name', field: fields.legalLastName },
      { id: 'field-suffix', field: fields.suffix },
      { id: 'field-date-of-birth', field: fields.dateOfBirth },
      { id: 'field-age', field: fields.age },
      { id: 'field-country', field: fields.country },
      { id: 'field-physical-address', field: fields.physicalAddress },
      { id: 'field-apartment-unit', field: fields.apartmentUnit },
      { id: 'field-city', field: fields.city },
      { id: 'field-us-state', field: fields.usStateTerritory },
      { id: 'field-zip-code', field: fields.zipCode },
    ];

    for (const { id, field } of structureFields) {
      const locator =
        field.type === 'dropdown'
          ? this.piPage.dropdown(field)
          : this.piPage.input(field);
      await this.checkVisible(id, locator, this.describeField(field));
    }

    await this.checkDisabled(
      'age-read-only',
      this.piPage.input(fields.age),
      'The Age field',
    );
    await this.checkVisible(
      'back-button',
      this.locators.backButton,
      'The Back button',
    );
    await this.checkVisible(
      'next-button',
      this.locators.nextButton,
      'The Next button',
    );
  }

  private async assertUsaDefaults(): Promise<void> {
    await this.checkVisible(
      'usa-default-state-visible',
      this.piPage.dropdown(this.data.fields.usStateTerritory),
      'The U.S. State / Territory dropdown',
    );
    await this.checkVisible(
      'usa-default-zip-visible',
      this.piPage.input(this.data.fields.zipCode),
      'The Zip Code field',
    );
    await this.checkHidden(
      'usa-default-other-country-hidden',
      this.piPage.input(this.data.fields.otherCountry),
      'The Other Country field',
    );
    await this.checkHidden(
      'mailing-fields-hidden-default',
      this.locators.mailingAddressLabel,
      'The U.S. Mailing Address fields',
    );
  }

  private async assertRequiredFields(): Promise<void> {
    await this.piPage.clickNext();
    await this.evaluate(
      'required-stay-on-page1',
      () => expect(this.locators.page1Indicator).toBeVisible(),
      {
        onPass:
          'The application remained on Page 1 of 2 after Next was clicked with the required fields empty.',
        onFail:
          'The application did not remain on Page 1 of 2 after Next was clicked with the required fields empty.',
      },
    );

    const fields = this.data.fields;
    const requiredFields: ReadonlyArray<{
      id: PiPage1ValidationId;
      field: PiPage1Field;
    }> = [
      { id: 'required-legal-first-name', field: fields.legalFirstName },
      { id: 'required-legal-last-name', field: fields.legalLastName },
      { id: 'required-date-of-birth', field: fields.dateOfBirth },
      { id: 'required-physical-address', field: fields.physicalAddress },
      { id: 'required-city', field: fields.city },
      { id: 'required-us-state', field: fields.usStateTerritory },
      { id: 'required-zip-code', field: fields.zipCode },
    ];

    for (const { id, field } of requiredFields) {
      await this.checkRequiredMessage(id, field);
    }
  }

  private async assertPersonalInformationRules(): Promise<void> {
    const fields = this.data.fields;
    await this.checkInputType(
      'first-name-text-type',
      fields.legalFirstName,
      'text',
    );
    await this.checkMandatory(
      'first-name-mandatory',
      fields.legalFirstName,
      'Legal First Name',
    );
    await this.checkAcceptedValue(
      'first-name-minimum',
      fields.legalFirstName,
      'A',
      'Legal First Name',
    );
    await this.checkMaximumLength(
      'first-name-maximum',
      fields.legalFirstName,
      20,
      'Legal First Name',
    );
    await this.checkAcceptedValue(
      'first-name-spaces',
      fields.legalFirstName,
      'Mary Ann',
      'Legal First Name',
    );
    await this.checkFieldError(
      'first-name-special-format',
      fields.legalFirstName,
      '!@#',
      'The value does not match the required format.',
    );
    await this.checkFieldError(
      'first-name-numeric-format',
      fields.legalFirstName,
      '123',
      'The value does not match the required format.',
    );
    await this.checkInvalidThenEmpty(
      'first-name-invalid-cleared',
      fields.legalFirstName,
      '123',
      'Please fill the required field',
    );

    await this.checkInputType(
      'middle-name-text-type',
      fields.middleName,
      'text',
    );
    await this.checkOptional(
      'middle-name-optional',
      fields.middleName,
      'Middle Name',
    );
    await this.checkNoErrorWhenEmpty(
      'middle-name-empty-valid',
      fields.middleName,
      'Middle Name',
    );
    await this.checkAcceptedValue(
      'middle-name-minimum',
      fields.middleName,
      'Q',
      'Middle Name',
    );
    await this.checkMaximumLength(
      'middle-name-maximum',
      fields.middleName,
      12,
      'Middle Name',
    );
    await this.checkAcceptedValue(
      'middle-name-spaces',
      fields.middleName,
      'Ann Marie',
      'Middle Name',
    );
    await this.checkFieldError(
      'middle-name-special-format',
      fields.middleName,
      '!@#',
      'The value does not match the required format.',
    );
    await this.checkFieldError(
      'middle-name-numeric-format',
      fields.middleName,
      '123',
      'The value does not match the required format.',
    );
    await this.checkInvalidThenEmpty(
      'middle-name-invalid-cleared',
      fields.middleName,
      '123',
      null,
    );

    await this.checkInputType(
      'last-name-text-type',
      fields.legalLastName,
      'text',
    );
    await this.checkMandatory(
      'last-name-mandatory',
      fields.legalLastName,
      'Legal Last Name',
    );
    await this.checkAcceptedValue(
      'last-name-minimum',
      fields.legalLastName,
      'D',
      'Legal Last Name',
    );
    await this.checkMaximumLength(
      'last-name-maximum',
      fields.legalLastName,
      25,
      'Legal Last Name',
    );
    await this.checkAcceptedValue(
      'last-name-spaces',
      fields.legalLastName,
      'Van Dyke',
      'Legal Last Name',
    );
    await this.checkFieldError(
      'last-name-special-format',
      fields.legalLastName,
      '!@#',
      'The value does not match the required format.',
    );
    await this.checkFieldError(
      'last-name-numeric-format',
      fields.legalLastName,
      '123',
      'The value does not match the required format.',
    );
    await this.checkInvalidThenEmpty(
      'last-name-invalid-cleared',
      fields.legalLastName,
      '123',
      'Please fill the required field',
    );
  }

  private async assertSuffixOptions(): Promise<void> {
    await this.piPage.dropdown(this.data.fields.suffix).click();
    for (const suffix of this.data.suffixOptions) {
      await this.evaluate(
        suffixOptionValidationId(suffix),
        () => expect(this.locators.dropdownOption(suffix)).toBeVisible(),
        {
          onPass: `The Suffix dropdown offered the option "${suffix}".`,
          onFail: `The Suffix dropdown did not offer the option "${suffix}".`,
        },
      );
    }
    await this.page.keyboard.press('Escape');
    if (await this.locators.openListbox.isVisible()) {
      await expect(this.locators.openListbox).toBeHidden();
    }
  }

  private async assertSuffixBehavior(): Promise<void> {
    const suffix = this.data.fields.suffix;
    await this.evaluate(
      'suffix-dropdown-type',
      async () => {
        await this.piPage.openDropdown(suffix);
        await expect(this.locators.openListbox).toBeVisible();
      },
      {
        onPass:
          'Clicking Suffix displayed a listbox containing the available suffix values.',
        onFail: 'Clicking Suffix did not display a dropdown listbox.',
      },
    );
    await this.piPage.closeOpenDropdown();

    await this.piPage.selectDropdown(suffix, this.data.suffixOptions[0]);
    await this.evaluate(
      'suffix-select-option',
      () =>
        expect(this.piPage.dropdown(suffix)).toHaveValue(
          this.data.suffixOptions[0],
        ),
      {
        onPass: `The available Suffix option "${this.data.suffixOptions[0]}" was selected.`,
        onFail: `The available Suffix option "${this.data.suffixOptions[0]}" could not be selected.`,
      },
    );
    await this.checkValue(
      'suffix-selected-display',
      this.piPage.dropdown(suffix),
      this.data.suffixOptions[0],
      'The Suffix field',
    );

    const updatedSuffix = this.data.suffixOptions[1];
    await this.piPage.selectDropdown(suffix, updatedSuffix);
    await this.checkValue(
      'suffix-change-selection',
      this.piPage.dropdown(suffix),
      updatedSuffix,
      'The Suffix field after changing the selection',
    );
    await this.evaluate(
      'suffix-single-selection',
      async () => {
        const value = await this.piPage.dropdown(suffix).inputValue();
        expect(value).toBe(updatedSuffix);
        expect(
          this.data.suffixOptions.filter((option) => value === option),
        ).toHaveLength(1);
      },
      {
        onPass: `The Suffix field retained only the latest selection "${updatedSuffix}".`,
        onFail:
          'The Suffix field did not behave as a single-selection dropdown.',
      },
    );

    await this.piPage.searchDropdown(suffix, 'II');
    await this.evaluate(
      'suffix-search',
      () => expect(this.locators.dropdownOption('II')).toBeVisible(),
      {
        onPass:
          'Typing "II" filtered the Suffix dropdown and displayed the matching option.',
        onFail:
          'Typing "II" did not display the matching Suffix dropdown option.',
      },
    );
    await this.piPage.closeOpenDropdown();

    await this.piPage.searchDropdown(suffix, 'UnavailableSuffix');
    await this.evaluate(
      'suffix-no-options',
      () => expect(this.locators.noOptionsMessage).toBeVisible(),
      {
        onPass:
          'Typing an unavailable Suffix value displayed the message "No options".',
        onFail:
          'Typing an unavailable Suffix value did not display the message "No options".',
      },
    );
    await this.piPage.closeOpenDropdown();
    await this.piPage.selectDropdown(suffix, updatedSuffix);
  }

  private async assertDobCalculatesAge(): Promise<void> {
    const dateOfBirth = this.data.valid.dateOfBirth;
    await this.piPage.enterDateOfBirth(dateOfBirth);
    const expectedAge = String(this.calculateAge(dateOfBirth));
    const ageField = this.piPage.input(this.data.fields.age);

    await this.evaluate(
      'age-calculated-from-dob',
      () => expect(ageField).toHaveValue(expectedAge),
      {
        onPass: async () =>
          `The Age field displayed "${await this.readValue(ageField)}" for the Date of Birth "${dateOfBirth}".`,
        onFail: async () => {
          const observed = await this.readValue(ageField);
          return observed
            ? `The Age field displayed "${observed}" instead of "${expectedAge}" for the Date of Birth "${dateOfBirth}".`
            : `The Age field remained empty after the Date of Birth "${dateOfBirth}" was entered.`;
        },
      },
    );
    await this.checkDisabled(
      'age-remains-read-only',
      ageField,
      'The calculated Age field',
    );
  }

  private async assertDateOfBirthRules(): Promise<void> {
    const fields = this.data.fields;
    const dob = this.piPage.input(fields.dateOfBirth);
    const age = this.piPage.input(fields.age);

    await dob.click();
    await this.evaluate(
      'dob-datepicker',
      () => expect(this.locators.datePickerPopover.first()).toBeVisible(),
      {
        onPass: 'Clicking Date of Birth displayed the date picker.',
        onFail: 'Clicking Date of Birth did not display the date picker.',
      },
    );
    if (await this.locators.datePickerPopover.first().isVisible()) {
      await this.locators.datePickerSelectableDay.click();
    }
    await this.evaluate(
      'dob-valid-selection',
      () => expect(dob).not.toHaveValue(''),
      {
        onPass: async () =>
          `Selecting an enabled date-picker day displayed "${await dob.inputValue()}" in Date of Birth.`,
        onFail:
          'Selecting an enabled date-picker day did not populate Date of Birth.',
      },
    );

    const validDob = this.data.valid.dateOfBirth;
    await this.piPage.enterDateOfBirth(validDob);
    await this.checkValue(
      'dob-format',
      dob,
      /^\d{2}\/\d{2}\/\d{4}$/,
      'The Date of Birth field using MM/DD/YYYY format',
    );

    await this.piPage.enterDateOfBirth(this.dateOffsetFromToday(1));
    await this.checkExistingFieldError(
      'dob-future-rejected',
      fields.dateOfBirth,
      'Date cannot be in the future.',
    );

    await this.piPage.enterDateOfBirth(this.dateForAge(151));
    await this.checkExistingFieldError(
      'dob-over-maximum-age',
      fields.dateOfBirth,
      'Please enter a valid date',
    );

    await this.piPage.enterDateOfBirth('2020-01-01');
    await this.checkExistingFieldError(
      'dob-invalid-format',
      fields.dateOfBirth,
      'Please enter valid date as per the format',
    );

    await this.piPage.clear(fields.dateOfBirth);
    await dob.blur();
    await this.evaluate(
      'age-zero-without-dob',
      async () => {
        await expect(age).toBeDisabled();
        await expect(age).toHaveValue('0');
      },
      {
        onPass:
          'With Date of Birth empty, the disabled Age field displayed zero.',
        onFail:
          'With Date of Birth empty, the Age field was not disabled with a zero value.',
      },
    );

    await dob.fill(validDob);
    await this.evaluate(
      'dob-direct-entry',
      () => expect(dob).toHaveValue(validDob),
      {
        onPass: `The Date of Birth field accepted the directly typed value "${validDob}".`,
        onFail: `The Date of Birth field did not retain the directly typed value "${validDob}".`,
      },
    );
  }

  private async assertCountryDropdownRules(): Promise<void> {
    const country = this.data.fields.country;
    await this.checkMandatory(
      'country-mandatory',
      country,
      'Country (Residential Country)',
    );

    await this.piPage.openDropdown(country);
    const countries = await this.piPage.getOpenDropdownOptions();
    const remainingCountries = countries.slice(1);
    const sortedCountries = this.sortAlphabetically(remainingCountries);
    await this.evaluate(
      'country-options-order',
      async () => {
        expect(countries[0]).toBe(this.data.country.usa);
        expect(remainingCountries).toEqual(sortedCountries);
      },
      {
        onPass:
          'United States of America was the first Country option and the remaining UI options were alphabetically ordered.',
        onFail: async () => {
          if (countries[0] !== this.data.country.usa) {
            return `The first Country option was "${countries[0] ?? 'none'}" instead of "${this.data.country.usa}". Observed order: ${countries.join(' | ')}.`;
          }
          return this.describeOrderingMismatch(
            'Country',
            remainingCountries,
            sortedCountries,
            2,
          );
        },
      },
    );
    await this.piPage.closeOpenDropdown();

    await this.piPage.selectCountry('canada');
    await this.checkValue(
      'country-select-option',
      this.piPage.dropdown(country),
      this.data.country.canada,
      'The Country field',
    );
    await this.evaluate(
      'country-single-selection',
      async () => {
        const value = await this.piPage.dropdown(country).inputValue();
        expect(value).toBe(this.data.country.canada);
      },
      {
        onPass:
          'The Country dropdown displayed only the selected value "Canada".',
        onFail:
          'The Country dropdown did not retain Canada as a single selected value.',
      },
    );

    await this.piPage.searchDropdown(country, 'Canada');
    await this.evaluate(
      'country-search',
      () =>
        expect(
          this.locators.dropdownOption(this.data.country.canada),
        ).toBeVisible(),
      {
        onPass:
          'Typing "Canada" filtered the Country dropdown to the matching option.',
        onFail: 'Typing "Canada" did not display the matching Country option.',
      },
    );
    await this.piPage.closeOpenDropdown();

    await this.piPage.searchDropdown(country, 'UnavailableCountryValue');
    await this.evaluate(
      'country-no-options',
      () => expect(this.locators.noOptionsMessage).toBeVisible(),
      {
        onPass:
          'Typing an unavailable country displayed the message "No options".',
        onFail:
          'Typing an unavailable country did not display the message "No options".',
      },
    );
    await this.piPage.closeOpenDropdown();

    await this.piPage.clearDropdown(country);
    await this.piPage.clickNext();
    await this.checkExistingFieldError(
      'country-empty-message',
      country,
      'Choose from list',
    );
    await this.piPage.selectCountry('usa');
  }

  private async assertCountryReflexiveFields(): Promise<void> {
    const fields = this.data.fields;

    await this.piPage.selectCountry('canada');
    await this.checkHidden(
      'canada-hides-us-state',
      this.piPage.dropdown(fields.usStateTerritory),
      'The U.S. State / Territory dropdown',
      'the residential country was Canada',
    );
    await this.checkHidden(
      'canada-hides-zip',
      this.piPage.input(fields.zipCode),
      'The U.S. Zip Code field',
      'the residential country was Canada',
    );
    await this.checkVisible(
      'canada-shows-foreign-state',
      this.locators.foreignStateInput,
      'The free-text State / Territory field',
      'the residential country was Canada',
    );
    await this.checkVisible(
      'canada-shows-foreign-postal',
      this.locators.foreignPostalCodeInput,
      'The Postal Code field',
      'the residential country was Canada',
    );

    await this.piPage.selectCountry('other');
    await this.checkVisible(
      'other-shows-other-country',
      this.piPage.input(fields.otherCountry),
      'The Other Country field',
      'the residential country was "Other"',
    );
    await this.checkHidden(
      'other-hides-us-state',
      this.piPage.dropdown(fields.usStateTerritory),
      'The U.S. State / Territory dropdown',
      'the residential country was "Other"',
    );
    await this.checkHidden(
      'other-hides-zip',
      this.piPage.input(fields.zipCode),
      'The U.S. Zip Code field',
      'the residential country was "Other"',
    );
    await this.checkVisible(
      'other-shows-foreign-state',
      this.locators.foreignStateInput,
      'The free-text State / Territory field',
      'the residential country was "Other"',
    );
    await this.checkVisible(
      'other-shows-foreign-postal',
      this.locators.foreignPostalCodeInput,
      'The Postal Code field',
      'the residential country was "Other"',
    );

    await this.piPage.selectCountry('usa');
    await this.checkVisible(
      'usa-restore-state-visible',
      this.piPage.dropdown(fields.usStateTerritory),
      'The U.S. State / Territory dropdown',
      'the residential country was changed back to United States of America',
    );
    await this.checkVisible(
      'usa-restore-zip-visible',
      this.piPage.input(fields.zipCode),
      'The Zip Code field',
      'the residential country was changed back to United States of America',
    );
    await this.checkHidden(
      'usa-restore-other-country-hidden',
      this.piPage.input(fields.otherCountry),
      'The Other Country field',
      'the residential country was changed back to United States of America',
    );
  }

  private async assertOtherCountryRules(): Promise<void> {
    const field = this.data.fields.otherCountry;
    await this.piPage.selectCountry('other');
    await this.checkMandatory(
      'other-country-mandatory',
      field,
      'Other Country',
    );
    await this.piPage.clickNext();
    await this.checkExistingFieldError(
      'other-country-required-message',
      field,
      'Please fill the required field',
    );
    await this.checkAcceptedValue(
      'other-country-minimum',
      field,
      'A',
      'Other Country',
    );
    await this.checkMaximumLength(
      'other-country-maximum',
      field,
      30,
      'Other Country',
    );
    await this.checkAcceptedValue(
      'other-country-spaces',
      field,
      'New Zealand',
      'Other Country',
    );
    await this.checkFieldError(
      'other-country-special-format',
      field,
      '!@#',
      'The value does not match the required format.',
    );
    await this.checkFieldError(
      'other-country-numeric-format',
      field,
      '123',
      'The value does not match the required format.',
    );
    await this.checkInvalidThenEmpty(
      'other-country-invalid-cleared',
      field,
      '123',
      'Please fill the required field',
    );
    await this.piPage.selectCountry('usa');
  }

  private async assertPhysicalAddressRules(): Promise<void> {
    const fields = this.data.fields;
    const address = this.piPage.input(fields.physicalAddress);
    await this.evaluate(
      'physical-address-text-required',
      async () => {
        await expect(address).toHaveAttribute('type', 'text');
        expect(await address.getAttribute('required')).not.toBeNull();
        await expect(address).toHaveAttribute(
          'placeholder',
          /Cannot be a P\.O\. Box/i,
        );
      },
      {
        onPass:
          'Physical Residential Address was a required text input labeled to prohibit P.O. Boxes.',
        onFail:
          'Physical Residential Address was not a required text input with the stated P.O. Box restriction.',
      },
    );
    await this.checkAcceptedValue(
      'physical-address-minimum',
      fields.physicalAddress,
      'A',
      'Physical Residential Address',
    );
    await this.checkFieldError(
      'physical-address-special-format',
      fields.physicalAddress,
      '!@#',
      'The value does not match the required format.',
    );
    await address.fill('P.O. Box 123');
    await address.blur();
    await this.evaluate(
      'physical-address-po-box-rejected',
      () => expect(this.piPage.error(fields.physicalAddress)).toBeVisible(),
      {
        onPass:
          'Physical Residential Address rejected "P.O. Box 123" with a validation message.',
        onFail:
          'Physical Residential Address accepted "P.O. Box 123" without a validation message despite the stated P.O. Box restriction.',
      },
    );

    await this.piPage.selectCountry('canada');
    // Canada renders its own address control, so the USA field id is not reusable here.
    const foreignAddress = this.locators.physicalAddressInputByLabel;
    await foreignAddress.fill('123 Main Street');
    await foreignAddress.blur();
    await this.evaluate(
      'physical-address-foreign-no-autofill',
      () => expect(this.locators.addressSuggestions.first()).toBeHidden(),
      {
        onPass:
          'With Canada selected, Physical Residential Address behaved as a textbox without an autofill suggestion list.',
        onFail:
          'Physical Residential Address displayed an autofill suggestion list while Canada was selected.',
      },
    );

    await this.piPage.selectCountry('usa');
    await expect(address).toBeVisible();

    await this.evaluate(
      'physical-address-prefill-editable',
      async () => {
        await expect(this.piPage.input(fields.apartmentUnit)).toBeEditable();
        await expect(this.piPage.input(fields.city)).toBeEditable();
        await expect(
          this.piPage.dropdown(fields.usStateTerritory),
        ).toBeEditable();
        await expect(this.piPage.input(fields.zipCode)).toBeEditable();
      },
      {
        onPass:
          'Apartment / Unit, City, U.S. State / Territory, and Zip Code remained editable after the autofill interaction.',
        onFail:
          'One or more dependent Physical Address fields became non-editable after the autofill interaction.',
      },
    );

    await address.fill('No Matching Address XYZ 987654');
    await address.blur();
    await this.evaluate(
      'physical-address-no-match',
      () => expect(this.locators.addressSuggestions.first()).toBeHidden(),
      {
        onPass:
          'A non-matching U.S. Physical Residential Address displayed no suggestion list.',
        onFail:
          'A non-matching U.S. Physical Residential Address unexpectedly displayed suggestions.',
      },
    );
  }

  private async assertApartmentAndPhysicalCityRules(): Promise<void> {
    const fields = this.data.fields;
    await this.evaluate(
      'apartment-optional-text',
      async () => {
        const input = this.piPage.input(fields.apartmentUnit);
        await expect(input).toHaveAttribute('type', 'text');
        expect(await input.getAttribute('required')).toBeNull();
      },
      {
        onPass:
          'Apartment / Unit was a text input and was not marked as required.',
        onFail: 'Apartment / Unit was not an optional text input.',
      },
    );
    await this.checkMaximumLength(
      'apartment-maximum',
      fields.apartmentUnit,
      12,
      'Apartment / Unit',
    );
    await this.checkMandatory(
      'physical-city-mandatory',
      fields.city,
      'Physical City',
    );
    await this.checkAcceptedValue(
      'physical-city-minimum',
      fields.city,
      'A',
      'Physical City',
    );
    await this.checkFieldError(
      'physical-city-special-format',
      fields.city,
      '!@#',
      'The value does not match the required format.',
    );
    await this.checkInvalidThenEmpty(
      'physical-city-invalid-cleared',
      fields.city,
      '!@#',
      'Please fill the required field',
    );
  }

  private async assertPhysicalStateRules(): Promise<void> {
    const field = this.data.fields.usStateTerritory;
    await this.piPage.clearDropdown(field);
    await this.piPage.clickNext();
    await this.checkMandatory(
      'physical-state-mandatory',
      field,
      'Physical U.S. State / Territory',
    );
    await this.assertDropdownOrdering('physical-state-order', field);
    await this.piPage.selectDropdown(field, this.data.valid.state);
    await this.checkValue(
      'physical-state-select',
      this.piPage.dropdown(field),
      new RegExp(this.data.valid.state, 'i'),
      'The Physical U.S. State / Territory field',
    );
    await this.checkValue(
      'physical-state-single',
      this.piPage.dropdown(field),
      new RegExp(`^${this.data.valid.state}$`, 'i'),
      'The single-selection Physical U.S. State / Territory field',
    );
    await this.assertDropdownSearch(
      'physical-state-search',
      'physical-state-no-options',
      field,
      this.data.valid.state,
    );
    await this.piPage.selectDropdown(field, this.data.valid.state);
  }

  private async assertPhysicalZipRules(): Promise<void> {
    const field = this.data.fields.zipCode;
    await this.piPage.fill(field, 'ABCDE');
    await this.piPage.input(field).blur();
    await this.evaluate(
      'physical-zip-numeric-required',
      async () => {
        expect(
          (await this.piPage.fieldContainer(field).textContent()) ?? '',
        ).toContain('*');
        await expect(this.piPage.error(field)).toBeVisible();
      },
      {
        onPass:
          'Physical Zip Code was marked as required and alphabetic input produced a validation error.',
        onFail:
          'Physical Zip Code was not marked as required or accepted alphabetic input without a validation error.',
      },
    );
    await this.checkFieldError(
      'physical-zip-too-short',
      field,
      '1234',
      'Minimum length should be 5 characters',
    );
    await this.checkZipIntermediateLengths(
      'physical-zip-intermediate-length',
      field,
      'Physical Zip Code',
    );
    await this.checkAcceptedValue(
      'physical-zip-five-digits',
      field,
      this.validZipCode(),
      'Physical Zip Code',
    );
    await this.checkAcceptedValue(
      'physical-zip-nine-digits',
      field,
      this.validNineDigitZipInput(),
      'Physical Zip Code',
      this.nineDigitZipPattern(),
    );
  }

  private async assertMailingQuestionRules(): Promise<void> {
    const field = this.data.fields.mailingSameAsPhysical;
    const yes = this.locators.radioInput(field.fieldId, 'yes');
    const no = this.locators.radioInput(field.fieldId, 'no');
    await this.evaluate(
      'mailing-question-mandatory',
      async () => {
        await expect(yes).toHaveAttribute('required', '');
        await expect(no).toHaveAttribute('required', '');
      },
      {
        onPass:
          'The Yes and No inputs for the mailing-address-same-as-physical question were marked as required.',
        onFail:
          'The mailing-address-same-as-physical question was not marked as mandatory.',
      },
    );
    await this.evaluate(
      'mailing-question-options',
      async () => {
        await expect(
          this.locators.radioOption(field.fieldId, 'yes'),
        ).toBeVisible();
        await expect(
          this.locators.radioOption(field.fieldId, 'no'),
        ).toBeVisible();
      },
      {
        onPass:
          'The mailing-address-same-as-physical question displayed both Yes and No options.',
        onFail:
          'The mailing-address-same-as-physical question did not display both Yes and No options.',
      },
    );
    if (!(await yes.isChecked()) && !(await no.isChecked())) {
      await this.piPage.clickNext();
      await this.checkExistingFieldError(
        'mailing-question-required-message',
        field,
        'Please fill the required field',
      );
    } else {
      this.matrix.markNotApplicable(
        'mailing-question-required-message',
        'The application UI supplied a preselected mailing-address answer, so unanswered-radio validation was not applicable on initial entry.',
      );
    }
  }

  private async assertMailingBehavior(): Promise<void> {
    await this.piPage.selectMailingSameAsPhysical('no');
    await this.checkVisible(
      'mailing-no-shows-fields',
      this.locators.mailingAddressLabel,
      'The U.S. Mailing Address fields',
      '"No" was selected for the mailing-address-same-as-physical question',
    );
    await this.piPage.selectMailingSameAsPhysical('yes');
    await this.checkHidden(
      'mailing-yes-hides-fields',
      this.locators.mailingAddressLabel,
      'The U.S. Mailing Address fields',
      '"Yes" was selected for the mailing-address-same-as-physical question',
    );
  }

  private async assertMailingAddressRules(): Promise<void> {
    const fields = this.data.fields;
    await this.piPage.fillValidForm();
    await this.piPage.selectMailingSameAsPhysical('no');

    await this.checkVisible(
      'mailing-address-field-visible',
      this.piPage.input(fields.mailingAddress),
      'The U.S. Mailing Address field',
      'No was selected for the mailing-address-same-as-physical question',
    );
    await this.checkVisible(
      'mailing-city-field-visible',
      this.piPage.input(fields.mailingCity),
      'The Mailing City field',
      'No was selected for the mailing-address-same-as-physical question',
    );
    await this.checkVisible(
      'mailing-state-field-visible',
      this.piPage.dropdown(fields.mailingStateTerritory),
      'The Mailing U.S. State / Territory field',
      'No was selected for the mailing-address-same-as-physical question',
    );
    await this.checkVisible(
      'mailing-zip-field-visible',
      this.piPage.input(fields.mailingZipCode),
      'The Mailing Zip Code field',
      'No was selected for the mailing-address-same-as-physical question',
    );

    await this.piPage.clickNext();
    await this.evaluate(
      'mandatory-mailing-blocks-next',
      () => expect(this.locators.page1Indicator).toBeVisible(),
      {
        onPass:
          'The application remained on Page 1 while required Mailing Address fields were unanswered.',
        onFail:
          'The application advanced despite unanswered required Mailing Address fields.',
      },
    );
    await this.checkExistingFieldError(
      'mailing-address-required-message',
      fields.mailingAddress,
      'Please fill the required field',
    );

    await this.checkMandatory(
      'mailing-city-mandatory',
      fields.mailingCity,
      'Mailing City',
    );
    await this.checkExistingFieldError(
      'mailing-city-required-message',
      fields.mailingCity,
      'Please fill the required field',
    );
    await this.checkAcceptedValue(
      'mailing-city-minimum',
      fields.mailingCity,
      'A',
      'Mailing City',
    );
    await this.checkFieldError(
      'mailing-city-special-format',
      fields.mailingCity,
      '!@#',
      'The value does not match the required format.',
    );
    await this.checkInvalidThenEmpty(
      'mailing-city-invalid-cleared',
      fields.mailingCity,
      '!@#',
      'Please fill the required field',
    );

    await this.checkExistingFieldError(
      'mailing-state-required-message',
      fields.mailingStateTerritory,
      'Please fill the required field',
    );
    await this.checkMandatory(
      'mailing-state-mandatory',
      fields.mailingStateTerritory,
      'Mailing U.S. State / Territory',
    );
    await this.assertDropdownOrdering(
      'mailing-state-order',
      fields.mailingStateTerritory,
    );
    await this.piPage.selectDropdown(
      fields.mailingStateTerritory,
      this.data.valid.mailingState,
    );
    await this.checkValue(
      'mailing-state-select',
      this.piPage.dropdown(fields.mailingStateTerritory),
      new RegExp(this.data.valid.mailingState, 'i'),
      'The Mailing U.S. State / Territory field',
    );
    await this.checkValue(
      'mailing-state-single',
      this.piPage.dropdown(fields.mailingStateTerritory),
      new RegExp(`^${this.data.valid.mailingState}$`, 'i'),
      'The single-selection Mailing U.S. State / Territory field',
    );
    await this.assertDropdownSearch(
      'mailing-state-search',
      'mailing-state-no-options',
      fields.mailingStateTerritory,
      this.data.valid.mailingState,
    );

    await this.piPage.fill(fields.mailingZipCode, 'ABCDE');
    await this.piPage.input(fields.mailingZipCode).blur();
    await this.evaluate(
      'mailing-zip-numeric-required',
      async () => {
        expect(
          (await this.piPage
            .fieldContainer(fields.mailingZipCode)
            .textContent()) ?? '',
        ).toContain('*');
        await expect(this.piPage.error(fields.mailingZipCode)).toBeVisible();
      },
      {
        onPass:
          'Mailing Zip Code was marked as required and alphabetic input produced a validation error.',
        onFail:
          'Mailing Zip Code was not marked as required or accepted alphabetic input without a validation error.',
      },
    );
    await this.piPage.clear(fields.mailingZipCode);
    await this.piPage.input(fields.mailingZipCode).blur();
    await this.checkExistingFieldError(
      'mailing-zip-required-message',
      fields.mailingZipCode,
      'Please fill the required field',
    );
    await this.checkFieldError(
      'mailing-zip-too-short',
      fields.mailingZipCode,
      '1234',
      'Minimum length should be 5 characters',
    );
    await this.checkZipIntermediateLengths(
      'mailing-zip-intermediate-length',
      fields.mailingZipCode,
      'Mailing Zip Code',
    );
    await this.checkAcceptedValue(
      'mailing-zip-five-digits',
      fields.mailingZipCode,
      this.validZipCode(),
      'Mailing Zip Code',
    );
    await this.checkAcceptedValue(
      'mailing-zip-nine-digits',
      fields.mailingZipCode,
      this.validNineDigitZipInput(),
      'Mailing Zip Code',
      this.nineDigitZipPattern(),
    );

    const mailingAddress = this.piPage.input(fields.mailingAddress);
    await this.piPage.selectCountry('usa');
    await this.piPage.selectMailingSameAsPhysical('no');
    await expect(mailingAddress).toBeVisible();

    await this.evaluate(
      'mailing-address-prefill-editable',
      async () => {
        await expect(this.piPage.input(fields.mailingCity)).toBeEditable();
        await expect(
          this.piPage.dropdown(fields.mailingStateTerritory),
        ).toBeEditable();
        await expect(this.piPage.input(fields.mailingZipCode)).toBeEditable();
      },
      {
        onPass:
          'Mailing City, U.S. State / Territory, and Zip Code remained editable after the autofill interaction.',
        onFail:
          'One or more dependent Mailing Address fields became non-editable after the autofill interaction.',
      },
    );

    await mailingAddress.fill('No Matching Mailing Address XYZ 987654');
    await mailingAddress.blur();
    await this.evaluate(
      'mailing-address-no-match',
      () => expect(this.locators.addressSuggestions.first()).toBeHidden(),
      {
        onPass:
          'A non-matching U.S. Mailing Address displayed no suggestion list.',
        onFail:
          'A non-matching U.S. Mailing Address unexpectedly displayed suggestions.',
      },
    );
    await this.piPage.selectMailingSameAsPhysical('yes');
  }

  private async assertOptionalFieldsDoNotBlockNavigation(): Promise<void> {
    const fields = this.data.fields;
    const valid = this.data.valid;

    // Rebuild a clean valid Page 1 in-place so earlier non-matching address tests
    // do not leave stale address state. Only optional text fields stay empty.
    await this.piPage.returnToPage1();
    await this.piPage.selectCountry('usa');
    await this.piPage.fill(fields.legalFirstName, valid.legalFirstName);
    await this.piPage.fill(fields.legalLastName, valid.legalLastName);
    await this.piPage.enterDateOfBirth(valid.dateOfBirth);
    await this.piPage.fill(fields.physicalAddress, valid.physicalAddress);
    await this.piPage.input(fields.physicalAddress).blur();
    await this.piPage.fill(fields.city, valid.city);
    await this.piPage.input(fields.city).blur();
    await this.piPage.selectDropdown(fields.usStateTerritory, valid.state);
    await this.piPage.fill(fields.zipCode, valid.zipCode);
    await this.piPage.input(fields.zipCode).blur();
    await this.piPage.selectMailingSameAsPhysical('yes');
    await this.piPage.clear(fields.middleName);
    await this.piPage.clear(fields.apartmentUnit);

    const missingRequired = await this.missingRequiredValues();
    const valuesBeforeNext = await this.describeFormValues();
    await this.evaluate(
      'optional-fields-do-not-block-next',
      async () => {
        expect(missingRequired).toEqual([]);
        await this.piPage.clickNext();
        await expect(this.locators.page2Indicator).toBeVisible({
          timeout: 15_000,
        });
      },
      {
        onPass:
          'The application advanced to Page 2 while optional Middle Name and Apartment / Unit were empty, required address values were valid, and all mandatory fields were populated.',
        onFail: async () => {
          if (missingRequired.length > 0) {
            return `Next was not clicked because these mandatory Page 1 values were empty: ${missingRequired.join(', ')}.`;
          }
          if (await this.piPage.isOnPage2()) {
            return `All mandatory Page 1 controls contained values and Next left Page 1, but the Page 2 indicator was not detected. Values before Next: ${valuesBeforeNext}.`;
          }
          const errors = await this.visiblePageErrors();
          return errors.length > 0
            ? `All mandatory Page 1 controls contained values, but the application stayed on Page 1 and displayed: ${errors.join(' | ')}. Values before Next: ${valuesBeforeNext}.`
            : `All mandatory Page 1 controls contained values, but the application did not advance to Page 2. Values before Next: ${valuesBeforeNext}.`;
        },
      },
    );
    await this.piPage.returnToPage1();
  }

  private async assertValidNavigationAndPersistence(): Promise<void> {
    await this.piPage.fillValidForm();
    const persistedSuffix =
      this.data.suffixOptions[this.data.suffixOptions.length - 1] ?? 'IV';
    await this.piPage.selectDropdown(this.data.fields.suffix, persistedSuffix);
    await this.piPage.clickNext();

    await this.evaluate(
      'navigation-reaches-page2',
      async () => {
        await expect(this.locators.page2Indicator).toBeVisible({
          timeout: 15_000,
        });
        await expect(
          this.piPage.input(this.data.fields.legalFirstName),
        ).toBeHidden();
      },
      {
        onPass: `The application advanced to Page 2 of 2 after Next was clicked with valid Proposed Primary Insured Page 1 information for ${this.executionContext!.stateName}.`,
        onFail: async () => {
          const messages = await this.page
            .locator(
              '.MuiFormHelperText-root.Mui-error:visible, [role="alert"]:visible',
            )
            .allTextContents();
          const visibleMessages = messages
            .map((message) => message.trim())
            .filter(Boolean);
          return visibleMessages.length > 0
            ? `The application stayed on Page 1 of 2 and displayed the validation message(s): ${visibleMessages.join(' | ')}.`
            : 'The application stayed on Page 1 of 2 and the "Page 2 of 2" indicator was never displayed.';
        },
      },
    );

    if (!(await this.piPage.isOnPage2())) {
      const reason =
        'This validation was not executed because Page 2 of 2 was not reached, so the Back navigation could not be performed.';
      for (const id of [
        'persist-legal-first-name',
        'persist-legal-last-name',
        'persist-date-of-birth',
        'persist-physical-address',
        'persist-us-state',
        'persist-zip-code',
        'persist-middle-name',
        'persist-apartment-unit',
        'persist-physical-city',
        'persist-country',
        'persist-mailing-choice',
        'suffix-persistence',
        'back-returns-page1',
        'updated-values-persist',
      ] as const) {
        this.matrix.markNotExecuted(id, reason);
      }
      return;
    }

    await this.piPage.clickBack();
    await this.evaluate(
      'back-returns-page1',
      () => expect(this.locators.page1Indicator).toBeVisible(),
      {
        onPass: 'Clicking Back on Page 2 returned to Page 1 of 2.',
        onFail: 'Clicking Back on Page 2 did not return to Page 1 of 2.',
      },
    );

    const fields = this.data.fields;
    const valid = this.data.valid;
    await this.checkValue(
      'persist-legal-first-name',
      this.piPage.input(fields.legalFirstName),
      valid.legalFirstName,
      'The Legal First Name field',
    );
    await this.checkValue(
      'persist-legal-last-name',
      this.piPage.input(fields.legalLastName),
      valid.legalLastName,
      'The Legal Last Name field',
    );
    await this.checkValue(
      'persist-date-of-birth',
      this.piPage.input(fields.dateOfBirth),
      valid.dateOfBirth,
      'The Date of Birth field',
    );
    await this.checkValue(
      'persist-physical-address',
      this.piPage.input(fields.physicalAddress),
      valid.physicalAddress,
      'The Physical Residential Address field',
    );
    await this.checkValue(
      'persist-us-state',
      this.piPage.dropdown(fields.usStateTerritory),
      new RegExp(valid.state, 'i'),
      'The U.S. State / Territory dropdown',
    );
    await this.checkValue(
      'persist-zip-code',
      this.piPage.input(fields.zipCode),
      valid.zipCode,
      'The Zip Code field',
    );
    await this.checkValue(
      'persist-middle-name',
      this.piPage.input(fields.middleName),
      valid.middleName,
      'The Middle Name field',
    );
    await this.checkValue(
      'persist-apartment-unit',
      this.piPage.input(fields.apartmentUnit),
      valid.apartmentUnit,
      'The Apartment / Unit field',
    );
    await this.checkValue(
      'persist-physical-city',
      this.piPage.input(fields.city),
      valid.city,
      'The Physical City field',
    );
    await this.checkValue(
      'persist-country',
      this.piPage.dropdown(fields.country),
      this.data.country.usa,
      'The Residential Country field',
    );
    await this.evaluate(
      'persist-mailing-choice',
      () =>
        expect(
          this.locators.radioInput(fields.mailingSameAsPhysical.fieldId, 'yes'),
        ).toBeChecked(),
      {
        onPass:
          'The mailing-address-same-as-physical answer remained Yes after returning from Page 2.',
        onFail:
          'The mailing-address-same-as-physical answer did not remain Yes after returning from Page 2.',
      },
    );
    await this.checkValue(
      'suffix-persistence',
      this.piPage.dropdown(fields.suffix),
      persistedSuffix,
      'The last updated Suffix field after returning from Page 2',
    );

    const updatedFirstName = 'Jane';
    const updatedSuffix = this.data.suffixOptions[0];
    await this.piPage.fill(fields.legalFirstName, updatedFirstName);
    await this.piPage.selectDropdown(fields.suffix, updatedSuffix);
    await this.piPage.clickNext();
    if (await this.piPage.waitForPage2()) {
      await this.piPage.clickBack();
      await this.evaluate(
        'updated-values-persist',
        async () => {
          await expect(this.locators.page1Indicator).toBeVisible();
          await expect(this.piPage.input(fields.legalFirstName)).toHaveValue(
            updatedFirstName,
          );
          await expect(this.piPage.dropdown(fields.suffix)).toHaveValue(
            updatedSuffix,
          );
        },
        {
          onPass: `After a second Next and Back cycle, Legal First Name remained "${updatedFirstName}" and Suffix remained "${updatedSuffix}".`,
          onFail:
            'One or more values modified after the first Back navigation did not persist through the second Next and Back cycle.',
        },
      );
    } else {
      this.matrix.markNotExecuted(
        'updated-values-persist',
        'This validation was not executed because the application did not reach Page 2 after the Page 1 values were updated.',
      );
    }
  }

  private async checkInputType(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    expectedType: string,
  ): Promise<void> {
    const input = this.piPage.input(field);
    await this.evaluate(
      id,
      () => expect(input).toHaveAttribute('type', expectedType),
      {
        onPass: `${field.label} used the HTML input type "${expectedType}".`,
        onFail: async () =>
          `${field.label} used input type "${(await input.getAttribute('type')) ?? 'not specified'}" instead of "${expectedType}".`,
      },
    );
  }

  private async checkMandatory(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    subject: string,
  ): Promise<void> {
    const container = this.piPage.fieldContainer(field);
    await this.evaluate(
      id,
      async () => {
        const text = (await container.textContent()) ?? '';
        expect(text).toContain('*');
      },
      {
        onPass: `${subject} was marked as mandatory with the required-field indicator.`,
        onFail: `${subject} was not marked as mandatory in the rendered Page 1 form.`,
      },
    );
  }

  private async checkOptional(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    subject: string,
  ): Promise<void> {
    const input = this.piPage.input(field);
    const container = this.piPage.fieldContainer(field);
    await this.evaluate(
      id,
      async () => {
        expect((await container.textContent()) ?? '').not.toContain('*');
        expect(await input.getAttribute('required')).toBeNull();
      },
      {
        onPass: `${subject} had no required indicator and was not marked as required.`,
        onFail: `${subject} was marked as required even though it should be optional.`,
      },
    );
  }

  private async checkAcceptedValue(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    value: string,
    subject: string,
    accepted: string | RegExp = value,
  ): Promise<void> {
    const input = this.piPage.input(field);
    await input.fill(value);
    await input.blur();
    await this.evaluate(
      id,
      async () => {
        await expect(input).toHaveValue(accepted);
        await expect(this.piPage.error(field)).toBeHidden();
      },
      {
        onPass: async () => {
          const stored = await input.inputValue();
          return stored === value
            ? `${subject} accepted and displayed the value "${value}" without a validation error.`
            : `${subject} accepted the value "${value}" and displayed it in the application's own format as "${stored}" without a validation error.`;
        },
        onFail: async () => {
          const stored = await input.inputValue();
          const error = await this.visibleErrorText(field);
          return `${subject} displayed "${stored}" after "${value}" was entered${error ? ` and showed "${error}"` : ''}.`;
        },
      },
    );
  }

  private async checkMaximumLength(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    maximum: number,
    subject: string,
  ): Promise<void> {
    const attempted = 'A'.repeat(maximum + 1);
    const input = this.piPage.input(field);
    await input.fill(attempted);
    await this.evaluate(
      id,
      async () => {
        expect((await input.inputValue()).length).toBe(maximum);
      },
      {
        onPass: `${subject} retained exactly ${maximum} characters when ${maximum + 1} characters were entered.`,
        onFail: async () =>
          `${subject} retained ${(await input.inputValue()).length} characters when ${maximum + 1} characters were entered.`,
      },
    );
  }

  private async checkFieldError(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    value: string,
    expectedMessage: string,
  ): Promise<void> {
    const input = this.piPage.input(field);
    await input.fill(value);
    await input.blur();
    await this.checkExistingFieldError(id, field, expectedMessage, value);
  }

  private async checkZipIntermediateLengths(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    subject: string,
  ): Promise<void> {
    const input = this.piPage.input(field);
    const values = ['123456', '1234567', '12345678'];
    await this.evaluate(
      id,
      async () => {
        for (const value of values) {
          await input.fill(value);
          await input.blur();
          await expect(this.piPage.error(field)).toHaveText(
            'The value does not match the required format.',
          );
        }
      },
      {
        onPass: `${subject} displayed "The value does not match the required format." for six-, seven-, and eight-digit values.`,
        onFail: async () =>
          `${subject} did not consistently reject all six-, seven-, and eight-digit values; the last observed message was "${await this.visibleErrorText(field)}".`,
      },
    );
  }

  private async checkExistingFieldError(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    expectedMessage: string,
    enteredValue?: string,
  ): Promise<void> {
    const error = this.piPage.error(field);
    await this.evaluate(id, () => expect(error).toHaveText(expectedMessage), {
      onPass: `${field.label}${enteredValue ? ` displayed "${enteredValue}" and` : ''} showed the validation message "${expectedMessage}".`,
      onFail: async () => {
        const observed = await this.visibleErrorText(field);
        return observed
          ? `${field.label} displayed the validation message "${observed}" instead of "${expectedMessage}".`
          : `${field.label} displayed no validation message; "${expectedMessage}" was expected.`;
      },
    });
  }

  private async checkInvalidThenEmpty(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    invalidValue: string,
    expectedMessage: string | null,
  ): Promise<void> {
    const input = this.piPage.input(field);
    await input.fill(invalidValue);
    await input.blur();
    await input.fill('');
    await input.blur();
    const error = this.piPage.error(field);
    await this.evaluate(
      id,
      () =>
        expectedMessage
          ? expect(error).toHaveText(expectedMessage)
          : expect(error).toBeHidden(),
      {
        onPass: expectedMessage
          ? `After invalid ${field.label} content was removed, the validation changed to "${expectedMessage}".`
          : `After invalid ${field.label} content was removed, its validation message disappeared.`,
        onFail: async () => {
          const observed = await this.visibleErrorText(field);
          return expectedMessage
            ? `After invalid ${field.label} content was removed, the observed message was "${observed || 'none'}" instead of "${expectedMessage}".`
            : `After invalid ${field.label} content was removed, the message "${observed}" remained visible.`;
        },
      },
    );
  }

  private async checkNoErrorWhenEmpty(
    id: PiPage1ValidationId,
    field: PiPage1Field,
    subject: string,
  ): Promise<void> {
    await this.piPage.clear(field);
    await this.piPage.input(field).blur();
    await this.evaluate(
      id,
      () => expect(this.piPage.error(field)).toBeHidden(),
      {
        onPass: `${subject} remained empty without displaying a validation error.`,
        onFail: async () =>
          `${subject} displayed the validation message "${await this.visibleErrorText(field)}" while empty.`,
      },
    );
  }

  private async assertDropdownOrdering(
    id: PiPage1ValidationId,
    field: PiPage1Field,
  ): Promise<void> {
    await this.piPage.openDropdown(field);
    const options = await this.piPage.getOpenDropdownOptions();
    const sortedOptions = this.sortAlphabetically(options);
    await this.evaluate(
      id,
      async () => {
        expect(options).toEqual(sortedOptions);
      },
      {
        onPass: `${field.label} displayed ${options.length} UI options in alphabetical order.`,
        onFail: this.describeOrderingMismatch(
          field.label,
          options,
          sortedOptions,
        ),
      },
    );
    await this.piPage.closeOpenDropdown();
  }

  private async assertDropdownSearch(
    searchId: PiPage1ValidationId,
    noOptionsId: PiPage1ValidationId,
    field: PiPage1Field,
    validOption: string,
  ): Promise<void> {
    await this.piPage.searchDropdown(field, validOption);
    await this.evaluate(
      searchId,
      () => expect(this.locators.dropdownOption(validOption)).toBeVisible(),
      {
        onPass: `Typing "${validOption}" displayed the matching ${field.label} option.`,
        onFail: `Typing "${validOption}" did not display the matching ${field.label} option.`,
      },
    );
    await this.piPage.closeOpenDropdown();
    await this.piPage.searchDropdown(field, 'UnavailableOptionValue');
    await this.evaluate(
      noOptionsId,
      () => expect(this.locators.noOptionsMessage).toBeVisible(),
      {
        onPass: `Typing an unavailable ${field.label} value displayed "No options".`,
        onFail: `Typing an unavailable ${field.label} value did not display "No options".`,
      },
    );
    await this.piPage.closeOpenDropdown();
  }

  private async describeFormValues(): Promise<string> {
    if (!(await this.piPage.isOnPage1())) {
      return 'Page 1 form was not visible when values were captured.';
    }

    const fields = this.data.fields;
    const read = async (label: string, control: Locator) => {
      if (!(await control.isVisible())) {
        return `${label}="(not visible)"`;
      }
      return `${label}="${(await control.inputValue()).trim() || '(empty)'}"`;
    };
    const parts = await Promise.all([
      read('Legal First Name', this.piPage.input(fields.legalFirstName)),
      read('Middle Name', this.piPage.input(fields.middleName)),
      read('Legal Last Name', this.piPage.input(fields.legalLastName)),
      read('Suffix', this.piPage.dropdown(fields.suffix)),
      read('Date of Birth', this.piPage.input(fields.dateOfBirth)),
      read('Country', this.piPage.dropdown(fields.country)),
      read(
        'Physical Residential Address',
        this.piPage.input(fields.physicalAddress),
      ),
      read('Apartment / Unit', this.piPage.input(fields.apartmentUnit)),
      read('City', this.piPage.input(fields.city)),
      read(
        'U.S. State / Territory',
        this.piPage.dropdown(fields.usStateTerritory),
      ),
      read('Zip Code', this.piPage.input(fields.zipCode)),
    ]);

    const fieldId = fields.mailingSameAsPhysical.fieldId;
    const yesChecked = await this.locators
      .radioInput(fieldId, 'yes')
      .isChecked();
    const noChecked = await this.locators.radioInput(fieldId, 'no').isChecked();
    parts.push(
      yesChecked
        ? 'Mailing same as physical=Yes'
        : noChecked
          ? 'Mailing same as physical=No'
          : 'Mailing same as physical=(unanswered)',
    );

    return parts.join('; ');
  }

  private async missingRequiredValues(): Promise<string[]> {
    const fields = this.data.fields;
    const controls: ReadonlyArray<readonly [string, Locator]> = [
      ['Legal First Name', this.piPage.input(fields.legalFirstName)],
      ['Legal Last Name', this.piPage.input(fields.legalLastName)],
      ['Date of Birth', this.piPage.input(fields.dateOfBirth)],
      ['Country', this.piPage.dropdown(fields.country)],
      [
        'Physical Residential Address',
        this.piPage.input(fields.physicalAddress),
      ],
      ['City', this.piPage.input(fields.city)],
      ['U.S. State / Territory', this.piPage.dropdown(fields.usStateTerritory)],
      ['Zip Code', this.piPage.input(fields.zipCode)],
    ];
    const values = await Promise.all(
      controls.map(async ([label, control]) => ({
        label,
        value: (await control.inputValue()).trim(),
      })),
    );
    const missing = values
      .filter(({ value }) => value.length === 0)
      .map(({ label }) => label);
    const fieldId = fields.mailingSameAsPhysical.fieldId;
    const yesChecked = await this.locators
      .radioInput(fieldId, 'yes')
      .isChecked();
    const noChecked = await this.locators.radioInput(fieldId, 'no').isChecked();
    if (!yesChecked && !noChecked) {
      missing.push('Mailing address same as physical');
    } else if (noChecked) {
      const mailingControls: ReadonlyArray<readonly [string, Locator]> = [
        ['U.S. Mailing Address', this.piPage.input(fields.mailingAddress)],
        ['Mailing City', this.piPage.input(fields.mailingCity)],
        [
          'Mailing U.S. State / Territory',
          this.piPage.dropdown(fields.mailingStateTerritory),
        ],
        ['Mailing Zip Code', this.piPage.input(fields.mailingZipCode)],
      ];
      const mailingValues = await Promise.all(
        mailingControls.map(async ([label, control]) => ({
          label,
          value: (await control.inputValue()).trim(),
        })),
      );
      missing.push(
        ...mailingValues
          .filter(({ value }) => value.length === 0)
          .map(({ label }) => label),
      );
    }
    return missing;
  }

  private async visiblePageErrors(): Promise<string[]> {
    const messages = await this.page
      .locator(
        '.MuiFormHelperText-root.Mui-error:visible, [role="alert"]:visible',
      )
      .allTextContents();
    return messages.map((message) => message.trim()).filter(Boolean);
  }

  private sortAlphabetically(options: readonly string[]): string[] {
    return [...options].sort((left, right) =>
      left.localeCompare(right, undefined, { sensitivity: 'base' }),
    );
  }

  private describeOrderingMismatch(
    subject: string,
    actual: readonly string[],
    expected: readonly string[],
    positionOffset = 1,
  ): string {
    const mismatch = actual.findIndex(
      (option, index) => option !== expected[index],
    );
    if (mismatch < 0) {
      return `${subject} returned a different number of options than expected. Observed order: ${actual.join(' | ')}.`;
    }
    return `${subject} was not alphabetical at position ${mismatch + positionOffset}: observed "${actual[mismatch]}", while alphabetical order required "${expected[mismatch]}". Observed order: ${actual.join(' | ')}.`;
  }

  private async visibleErrorText(field: PiPage1Field): Promise<string> {
    const error = this.piPage.error(field);
    if (!(await error.isVisible())) {
      return '';
    }
    return ((await error.textContent()) ?? '').trim();
  }

  private async checkVisible(
    id: PiPage1ValidationId,
    locator: Locator,
    subject: string,
    condition?: string,
  ): Promise<void> {
    const context = condition ? ` when ${condition}` : ` on ${PAGE_1}`;
    await this.evaluate(id, () => expect(locator).toBeVisible(), {
      onPass: `${subject} was displayed${context}.`,
      onFail: `${subject} was not displayed${context}.`,
    });
  }

  private async checkHidden(
    id: PiPage1ValidationId,
    locator: Locator,
    subject: string,
    condition?: string,
  ): Promise<void> {
    const context = condition ? ` when ${condition}` : ` on ${PAGE_1}`;
    await this.evaluate(id, () => expect(locator).toBeHidden(), {
      onPass: `${subject} was not displayed${context}, as expected.`,
      onFail: `${subject} was still displayed${context}.`,
    });
  }

  private async checkDisabled(
    id: PiPage1ValidationId,
    locator: Locator,
    subject: string,
  ): Promise<void> {
    await this.evaluate(id, () => expect(locator).toBeDisabled(), {
      onPass: `${subject} was read-only and could not be edited by the user.`,
      onFail: `${subject} was editable instead of read-only.`,
    });
  }

  private async checkValue(
    id: PiPage1ValidationId,
    locator: Locator,
    expectedValue: string | RegExp,
    subject: string,
  ): Promise<void> {
    await this.evaluate(id, () => expect(locator).toHaveValue(expectedValue), {
      onPass: async () =>
        `${subject} displayed the value "${await this.readValue(locator)}".`,
      onFail: async () => {
        const observed = await this.readValue(locator);
        return observed
          ? `${subject} displayed the value "${observed}", which does not match the expected value.`
          : `${subject} was empty.`;
      },
    });
  }

  private async checkRequiredMessage(
    id: PiPage1ValidationId,
    field: PiPage1Field,
  ): Promise<void> {
    const error = this.piPage.error(field);
    const expectedMessage =
      field.fieldId === this.data.fields.physicalAddress.fieldId
        ? 'Enter a location'
        : field.type === 'dropdown'
          ? 'Choose from list'
          : 'Please fill the required field';
    await this.evaluate(id, () => expect(error).toHaveText(expectedMessage), {
      onPass: async () => {
        const message = await this.readText(error);
        return `The validation message "${message}" was displayed for ${field.label}.`;
      },
      onFail: async () => {
        const observed = await this.visibleErrorText(field);
        return observed
          ? `${field.label} displayed "${observed}" instead of "${expectedMessage}".`
          : `No required-field validation message was displayed for ${field.label} after Next was clicked without a value.`;
      },
    });
  }

  private async evaluate(
    id: PiPage1ValidationId,
    assertion: () => Promise<void>,
    describe: { onPass: ActualDescription; onFail: ActualDescription },
  ): Promise<void> {
    try {
      await assertion();
      const actual = await this.resolve(describe.onPass);
      this.matrix.record(id, 'PASS', actual);
      this.logger.info(`[PASS] ${id} — ${actual}`);
      await this.attach(this.formatEvidence(id, 'PASS', actual), 'text/plain');
    } catch (error) {
      const actual = await this.resolve(describe.onFail);
      const message = error instanceof Error ? error.message : String(error);
      this.matrix.record(id, 'FAIL', actual);
      this.failures.push(`${id}: ${actual}`);
      this.logger.error(`[FAIL] ${id} — ${actual}`);
      await this.attach(
        `${this.formatEvidence(id, 'FAIL', actual)}\n\nAssertion detail:\n${message}`,
        'text/plain',
      );
    }
  }

  private formatEvidence(
    id: PiPage1ValidationId,
    result: 'PASS' | 'FAIL',
    actual: string,
  ): string {
    const planned = PI_PAGE1_VALIDATIONS.find(
      (validation) => validation.id === id,
    );
    return [
      `[${result}] ${planned?.category ?? 'Validation'} — ${planned?.validation ?? id}`,
      '',
      `Expected: ${planned?.expected ?? ''}`,
      `Actual: ${actual}`,
      `Result: ${result}`,
    ].join('\n');
  }

  private async resolve(description: ActualDescription): Promise<string> {
    return typeof description === 'string' ? description : description();
  }

  private async readValue(locator: Locator): Promise<string> {
    return (await locator.inputValue().catch(() => '')).trim();
  }

  private async readText(locator: Locator): Promise<string> {
    return ((await locator.textContent().catch(() => '')) ?? '').trim();
  }

  private validZipCode(): string {
    return this.data.valid.zipCode;
  }

  private validNineDigitZipInput(): string {
    const fiveDigitZip = this.validZipCode().replace(/\D/g, '').slice(0, 5);
    return `${fiveDigitZip}1234`;
  }

  private nineDigitZipPattern(): RegExp {
    const fiveDigitZip = this.validZipCode().replace(/\D/g, '').slice(0, 5);
    const nineDigitZip = `${fiveDigitZip}1234`;
    return new RegExp(`^${nineDigitZip}$|^${fiveDigitZip}-1234$`);
  }

  private describeField(field: PiPage1Field): string {
    return field.type === 'dropdown'
      ? `The ${field.label} dropdown`
      : `The ${field.label} field`;
  }

  private dateForAge(age: number): string {
    const today = new Date();
    return this.formatDate(
      new Date(today.getFullYear() - age, today.getMonth(), today.getDate()),
    );
  }

  private dateOffsetFromToday(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.formatDate(date);
  }

  private formatDate(date: Date): string {
    return [
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
      date.getFullYear(),
    ].join('/');
  }

  private calculateAge(dob: string): number {
    const [month, day, year] = dob.split('/').map(Number);
    const today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) {
      age -= 1;
    }
    return age;
  }
}
