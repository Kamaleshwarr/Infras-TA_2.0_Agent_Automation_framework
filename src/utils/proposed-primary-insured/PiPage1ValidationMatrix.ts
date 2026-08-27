import { CucumberAttach } from '../../interfaces';

export type PiPage1ValidationResult = 'PASS' | 'FAIL' | 'N/A' | 'NOT EXECUTED';

export interface PiPage1PlannedValidation {
  id: string;
  category: string;
  validation: string;
  expected: string;
}

export interface PiPage1ValidationRow extends PiPage1PlannedValidation {
  actual: string;
  result: PiPage1ValidationResult;
}

const PAGE_1 = 'Proposed Primary Insured Page 1';

/**
 * Regression catalog for the Proposed Primary Insured Page 1 flow.
 * Every entry maps 1:1 to an assertion implemented in
 * ProposedPrimaryInsuredPage1Assertions and is listed in execution order.
 */
const EXISTING_PI_PAGE1_VALIDATIONS = [
  {
    id: 'page-heading',
    category: 'Page Structure',
    validation: 'Proposed Primary Insured Details heading displayed',
    expected: `The "Proposed Primary Insured Details" heading should be visible on ${PAGE_1}.`,
  },
  {
    id: 'page-indicator',
    category: 'Page Structure',
    validation: 'Page 1 of 2 indicator displayed',
    expected: `The "Page 1 of 2" indicator should be visible on ${PAGE_1}.`,
  },
  {
    id: 'mailing-question',
    category: 'Page Structure',
    validation: 'U.S. Mailing Address same-as-physical question displayed',
    expected:
      'The question "Is U.S. Mailing Address same as Physical Residential Address?" should be visible on the form.',
  },
  {
    id: 'field-legal-first-name',
    category: 'Personal Information',
    validation: 'Legal First Name field displayed',
    expected: `The Legal First Name field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-middle-name',
    category: 'Personal Information',
    validation: 'Middle Name field displayed',
    expected: `The Middle Name field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-legal-last-name',
    category: 'Personal Information',
    validation: 'Legal Last Name field displayed',
    expected: `The Legal Last Name field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-suffix',
    category: 'Personal Information',
    validation: 'Suffix dropdown displayed',
    expected: `The Suffix dropdown should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-date-of-birth',
    category: 'Personal Information',
    validation: 'Date of Birth field displayed',
    expected: `The Date of Birth field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-age',
    category: 'Personal Information',
    validation: 'Age field displayed',
    expected: `The Age field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-country',
    category: 'Address Information',
    validation: 'Country dropdown displayed',
    expected: `The Country (Residential Country) dropdown should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-physical-address',
    category: 'Address Information',
    validation: 'Physical Residential Address field displayed',
    expected: `The Physical Residential Address field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-apartment-unit',
    category: 'Address Information',
    validation: 'Apartment / Unit field displayed',
    expected: `The Apartment / Unit field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-city',
    category: 'Address Information',
    validation: 'City field displayed',
    expected: `The City field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-us-state',
    category: 'Address Information',
    validation: 'U.S. State / Territory dropdown displayed',
    expected: `The U.S. State / Territory dropdown should be visible on ${PAGE_1}.`,
  },
  {
    id: 'field-zip-code',
    category: 'Address Information',
    validation: 'Zip Code field displayed',
    expected: `The Zip Code field should be visible on ${PAGE_1}.`,
  },
  {
    id: 'age-read-only',
    category: 'Personal Information',
    validation: 'Age field is read-only for the user',
    expected:
      'The Age field should be read-only because the value is calculated by the application from the Date of Birth.',
  },
  {
    id: 'back-button',
    category: 'Page Structure',
    validation: 'Back button displayed',
    expected: `The Back button should be visible on ${PAGE_1}.`,
  },
  {
    id: 'next-button',
    category: 'Page Structure',
    validation: 'Next button displayed',
    expected: `The Next button should be visible on ${PAGE_1}.`,
  },
  {
    id: 'usa-default-state-visible',
    category: 'Country Defaults',
    validation:
      'U.S. State / Territory available on the default United States path',
    expected:
      'The U.S. State / Territory dropdown should be displayed when the residential country is the default United States of America.',
  },
  {
    id: 'usa-default-zip-visible',
    category: 'Country Defaults',
    validation: 'Zip Code available on the default United States path',
    expected:
      'The Zip Code field should be displayed when the residential country is the default United States of America.',
  },
  {
    id: 'usa-default-other-country-hidden',
    category: 'Country Defaults',
    validation: 'Other Country hidden on the default United States path',
    expected:
      'The Other Country field should not be displayed while the residential country is the default United States of America.',
  },
  {
    id: 'mailing-fields-hidden-default',
    category: 'Mailing Address',
    validation: 'U.S. Mailing Address fields hidden on initial page entry',
    expected:
      'The U.S. Mailing Address fields should not be displayed when the page is first opened and the mailing address is the same as the physical address.',
  },
  {
    id: 'required-stay-on-page1',
    category: 'Required Validation',
    validation: 'Navigation blocked when required fields are empty',
    expected:
      'The application should remain on Page 1 of 2 when Next is clicked while the required fields are empty.',
  },
  {
    id: 'required-legal-first-name',
    category: 'Required Validation',
    validation: 'Legal First Name required field validation',
    expected:
      'A required-field validation message should be displayed for Legal First Name when Next is clicked with the field empty.',
  },
  {
    id: 'required-legal-last-name',
    category: 'Required Validation',
    validation: 'Legal Last Name required field validation',
    expected:
      'A required-field validation message should be displayed for Legal Last Name when Next is clicked with the field empty.',
  },
  {
    id: 'required-date-of-birth',
    category: 'Required Validation',
    validation: 'Date of Birth required field validation',
    expected:
      'A required-field validation message should be displayed for Date of Birth when Next is clicked with the field empty.',
  },
  {
    id: 'required-physical-address',
    category: 'Required Validation',
    validation: 'Physical Residential Address required field validation',
    expected:
      'The message "Enter a location" should be displayed for Physical Residential Address when Next is clicked with the field empty.',
  },
  {
    id: 'required-city',
    category: 'Required Validation',
    validation: 'City required field validation',
    expected:
      'A required-field validation message should be displayed for City when Next is clicked with the field empty.',
  },
  {
    id: 'required-us-state',
    category: 'Required Validation',
    validation: 'U.S. State / Territory required field validation',
    expected:
      'The message "Choose from list" should be displayed for U.S. State / Territory when Next is clicked without a selection.',
  },
  {
    id: 'required-zip-code',
    category: 'Required Validation',
    validation: 'Zip Code required field validation',
    expected:
      'A required-field validation message should be displayed for Zip Code when Next is clicked with the field empty.',
  },
  {
    id: 'suffix-option-jr',
    category: 'Suffix Options',
    validation: 'Suffix option "Jr" available',
    expected: 'The Suffix dropdown should offer the option "Jr".',
  },
  {
    id: 'suffix-option-sr',
    category: 'Suffix Options',
    validation: 'Suffix option "Sr" available',
    expected: 'The Suffix dropdown should offer the option "Sr".',
  },
  {
    id: 'suffix-option-i',
    category: 'Suffix Options',
    validation: 'Suffix option "I" available',
    expected: 'The Suffix dropdown should offer the option "I".',
  },
  {
    id: 'suffix-option-ii',
    category: 'Suffix Options',
    validation: 'Suffix option "II" available',
    expected: 'The Suffix dropdown should offer the option "II".',
  },
  {
    id: 'suffix-option-iii',
    category: 'Suffix Options',
    validation: 'Suffix option "III" available',
    expected: 'The Suffix dropdown should offer the option "III".',
  },
  {
    id: 'suffix-option-iv',
    category: 'Suffix Options',
    validation: 'Suffix option "IV" available',
    expected: 'The Suffix dropdown should offer the option "IV".',
  },
  {
    id: 'age-calculated-from-dob',
    category: 'Date of Birth and Age',
    validation: 'Age calculated automatically from Date of Birth',
    expected:
      'The Age field should display the age calculated from the entered Date of Birth.',
  },
  {
    id: 'age-remains-read-only',
    category: 'Date of Birth and Age',
    validation: 'Calculated Age remains read-only after Date of Birth entry',
    expected:
      'The Age field should remain read-only after the Date of Birth is entered and the age is calculated.',
  },
  {
    id: 'canada-hides-us-state',
    category: 'Reflexive Fields - Canada',
    validation: 'U.S. State / Territory removed for Canada',
    expected:
      'The U.S. State / Territory dropdown should no longer be displayed when the residential country is Canada.',
  },
  {
    id: 'canada-hides-zip',
    category: 'Reflexive Fields - Canada',
    validation: 'U.S. Zip Code removed for Canada',
    expected:
      'The U.S. Zip Code field should no longer be displayed when the residential country is Canada.',
  },
  {
    id: 'canada-shows-foreign-state',
    category: 'Reflexive Fields - Canada',
    validation: 'Foreign State / Territory displayed for Canada',
    expected:
      'The free-text State / Territory field should be displayed when the residential country is Canada.',
  },
  {
    id: 'canada-shows-foreign-postal',
    category: 'Reflexive Fields - Canada',
    validation: 'Foreign Postal Code displayed for Canada',
    expected:
      'The Postal Code field should be displayed when the residential country is Canada.',
  },
  {
    id: 'other-shows-other-country',
    category: 'Reflexive Fields - Other',
    validation: 'Other Country field displayed for country "Other"',
    expected:
      'The Other Country field should be displayed when the residential country is "Other".',
  },
  {
    id: 'other-hides-us-state',
    category: 'Reflexive Fields - Other',
    validation: 'U.S. State / Territory remains hidden for country "Other"',
    expected:
      'The U.S. State / Territory dropdown should not be displayed when the residential country is "Other".',
  },
  {
    id: 'other-hides-zip',
    category: 'Reflexive Fields - Other',
    validation: 'U.S. Zip Code remains hidden for country "Other"',
    expected:
      'The U.S. Zip Code field should not be displayed when the residential country is "Other".',
  },
  {
    id: 'other-shows-foreign-state',
    category: 'Reflexive Fields - Other',
    validation: 'Foreign State / Territory displayed for country "Other"',
    expected:
      'The free-text State / Territory field should be displayed when the residential country is "Other".',
  },
  {
    id: 'other-shows-foreign-postal',
    category: 'Reflexive Fields - Other',
    validation: 'Foreign Postal Code displayed for country "Other"',
    expected:
      'The Postal Code field should be displayed when the residential country is "Other".',
  },
  {
    id: 'usa-restore-state-visible',
    category: 'Reflexive Fields - United States',
    validation:
      'U.S. State / Territory restored when returning to United States',
    expected:
      'The U.S. State / Territory dropdown should be displayed again when the residential country is changed back to United States of America.',
  },
  {
    id: 'usa-restore-zip-visible',
    category: 'Reflexive Fields - United States',
    validation: 'U.S. Zip Code restored when returning to United States',
    expected:
      'The U.S. Zip Code field should be displayed again when the residential country is changed back to United States of America.',
  },
  {
    id: 'usa-restore-other-country-hidden',
    category: 'Reflexive Fields - United States',
    validation: 'Other Country removed when returning to United States',
    expected:
      'The Other Country field should no longer be displayed when the residential country is changed back to United States of America.',
  },
  {
    id: 'mailing-no-shows-fields',
    category: 'Mailing Address',
    validation: 'Mailing address fields displayed when mailing address differs',
    expected:
      'The U.S. Mailing Address fields should be displayed when "No" is selected for the mailing-address-same-as-physical question.',
  },
  {
    id: 'mailing-yes-hides-fields',
    category: 'Mailing Address',
    validation:
      'Mailing address fields hidden when mailing address is the same',
    expected:
      'The U.S. Mailing Address fields should be hidden again when "Yes" is selected for the mailing-address-same-as-physical question.',
  },
  {
    id: 'navigation-reaches-page2',
    category: 'Navigation',
    validation: 'Valid Page 1 information advances to Page 2',
    expected:
      'The application should advance to Page 2 of 2 when Next is clicked with valid Proposed Primary Insured Page 1 information for the selected application state.',
  },
  {
    id: 'persist-legal-first-name',
    category: 'Persistence',
    validation: 'Legal First Name retained after returning from Page 2',
    expected:
      'The Legal First Name entered before navigating forward should still be displayed after returning to Page 1 using Back.',
  },
  {
    id: 'persist-legal-last-name',
    category: 'Persistence',
    validation: 'Legal Last Name retained after returning from Page 2',
    expected:
      'The Legal Last Name entered before navigating forward should still be displayed after returning to Page 1 using Back.',
  },
  {
    id: 'persist-date-of-birth',
    category: 'Persistence',
    validation: 'Date of Birth retained after returning from Page 2',
    expected:
      'The Date of Birth entered before navigating forward should still be displayed after returning to Page 1 using Back.',
  },
  {
    id: 'persist-physical-address',
    category: 'Persistence',
    validation:
      'Physical Residential Address retained after returning from Page 2',
    expected:
      'The Physical Residential Address entered before navigating forward should still be displayed after returning to Page 1 using Back.',
  },
  {
    id: 'persist-us-state',
    category: 'Persistence',
    validation: 'U.S. State / Territory retained after returning from Page 2',
    expected:
      'The selected U.S. State / Territory should still be displayed after returning to Page 1 using Back.',
  },
  {
    id: 'persist-zip-code',
    category: 'Persistence',
    validation: 'Zip Code retained after returning from Page 2',
    expected:
      'The Zip Code entered before navigating forward should still be displayed after returning to Page 1 using Back.',
  },
] as const;

const EXPANDED_PI_PAGE1_VALIDATIONS = [
  {
    id: 'nav-section-available',
    category: 'Left Navigation',
    validation: 'Proposed Primary Insured section is available',
    expected:
      'The Proposed Primary Insured section should be displayed in the left-side application navigation.',
  },
  {
    id: 'nav-section-clickable',
    category: 'Left Navigation',
    validation: 'Proposed Primary Insured section is clickable',
    expected:
      'The Proposed Primary Insured section link should be enabled and clickable.',
  },
  {
    id: 'nav-section-expandable',
    category: 'Left Navigation',
    validation: 'Proposed Primary Insured section can be expanded',
    expected:
      'The Proposed Primary Insured section should expand when its available expand control is clicked.',
  },
  {
    id: 'nav-details-child-visible',
    category: 'Left Navigation',
    validation:
      'Proposed Primary Insured Details child navigation is available',
    expected:
      'The Proposed Primary Insured Details child item should be displayed while the Proposed Primary Insured section is expanded.',
  },
  {
    id: 'nav-military-child-visible',
    category: 'Left Navigation',
    validation: 'Military child navigation is available',
    expected:
      'The Military child item should be displayed while the Proposed Primary Insured section is expanded.',
  },
  {
    id: 'nav-details-opens-page1',
    category: 'Left Navigation',
    validation: 'Proposed Primary Insured Details navigation opens Page 1 of 2',
    expected:
      'Clicking Proposed Primary Insured Details should display Proposed Primary Insured Details - Page 1 of 2.',
  },
  {
    id: 'nav-military-opens-page1',
    category: 'Left Navigation',
    validation: 'Military navigation opens Page 1 of 1',
    expected: 'Clicking Military should display Military - Page 1 of 1.',
  },
  {
    id: 'personal-information-group',
    category: 'Page Structure',
    validation: 'Personal Information group displayed',
    expected:
      'The Proposed Primary Insured Personal Information group should be displayed on Page 1.',
  },
  {
    id: 'physical-address-group',
    category: 'Page Structure',
    validation: 'Physical Residential Address group displayed',
    expected:
      'The Physical Residential Address (Cannot be a P.O. Box) group should be displayed on Page 1.',
  },
  {
    id: 'first-name-text-type',
    category: 'Legal First Name',
    validation: 'Legal First Name is a text field',
    expected:
      'The Legal First Name control should have the HTML input type text.',
  },
  {
    id: 'first-name-mandatory',
    category: 'Legal First Name',
    validation: 'Legal First Name is mandatory',
    expected: 'The Legal First Name field should be marked as required.',
  },
  {
    id: 'first-name-minimum',
    category: 'Legal First Name',
    validation: 'Legal First Name accepts one character',
    expected: 'The Legal First Name field should accept a one-character value.',
  },
  {
    id: 'first-name-maximum',
    category: 'Legal First Name',
    validation: 'Legal First Name enforces a 20-character maximum',
    expected:
      'The Legal First Name field should retain no more than 20 characters.',
  },
  {
    id: 'first-name-spaces',
    category: 'Legal First Name',
    validation: 'Legal First Name accepts spaces',
    expected:
      'The Legal First Name field should accept a valid alphabetic name containing spaces.',
  },
  {
    id: 'first-name-special-format',
    category: 'Legal First Name',
    validation: 'Legal First Name rejects special characters',
    expected:
      'The Legal First Name field should display "The value does not match the required format." for special-character input.',
  },
  {
    id: 'first-name-numeric-format',
    category: 'Legal First Name',
    validation: 'Legal First Name rejects numeric input',
    expected:
      'The Legal First Name field should display "The value does not match the required format." for numeric input.',
  },
  {
    id: 'first-name-invalid-cleared',
    category: 'Legal First Name',
    validation:
      'Legal First Name returns to required validation after invalid input is cleared',
    expected:
      'After invalid Legal First Name content is removed, the field should display "Please fill the required field".',
  },
  {
    id: 'middle-name-text-type',
    category: 'Middle Name',
    validation: 'Middle Name is a text field',
    expected: 'The Middle Name control should have the HTML input type text.',
  },
  {
    id: 'middle-name-optional',
    category: 'Middle Name',
    validation: 'Middle Name is optional',
    expected: 'The Middle Name field should not be marked as required.',
  },
  {
    id: 'middle-name-empty-valid',
    category: 'Middle Name',
    validation: 'Empty Middle Name has no validation error',
    expected:
      'The optional Middle Name field should not display a validation error when empty.',
  },
  {
    id: 'middle-name-minimum',
    category: 'Middle Name',
    validation: 'Middle Name accepts one character',
    expected: 'The Middle Name field should accept a one-character value.',
  },
  {
    id: 'middle-name-maximum',
    category: 'Middle Name',
    validation: 'Middle Name enforces a 12-character maximum',
    expected: 'The Middle Name field should retain no more than 12 characters.',
  },
  {
    id: 'middle-name-spaces',
    category: 'Middle Name',
    validation: 'Middle Name accepts spaces',
    expected:
      'The Middle Name field should accept valid alphabetic content containing spaces.',
  },
  {
    id: 'middle-name-special-format',
    category: 'Middle Name',
    validation: 'Middle Name rejects special characters',
    expected:
      'The Middle Name field should display "The value does not match the required format." for special-character input.',
  },
  {
    id: 'middle-name-numeric-format',
    category: 'Middle Name',
    validation: 'Middle Name rejects numeric input',
    expected:
      'The Middle Name field should display "The value does not match the required format." for numeric input.',
  },
  {
    id: 'middle-name-invalid-cleared',
    category: 'Middle Name',
    validation:
      'Middle Name validation clears after invalid content is removed',
    expected:
      'The Middle Name validation message should disappear after invalid content is removed.',
  },
  {
    id: 'last-name-text-type',
    category: 'Legal Last Name',
    validation: 'Legal Last Name is a text field',
    expected:
      'The Legal Last Name control should have the HTML input type text.',
  },
  {
    id: 'last-name-mandatory',
    category: 'Legal Last Name',
    validation: 'Legal Last Name is mandatory',
    expected: 'The Legal Last Name field should be marked as required.',
  },
  {
    id: 'last-name-minimum',
    category: 'Legal Last Name',
    validation: 'Legal Last Name accepts one character',
    expected: 'The Legal Last Name field should accept a one-character value.',
  },
  {
    id: 'last-name-maximum',
    category: 'Legal Last Name',
    validation: 'Legal Last Name enforces a 25-character maximum',
    expected:
      'The Legal Last Name field should retain no more than 25 characters.',
  },
  {
    id: 'last-name-spaces',
    category: 'Legal Last Name',
    validation: 'Legal Last Name accepts spaces',
    expected:
      'The Legal Last Name field should accept a valid alphabetic name containing spaces.',
  },
  {
    id: 'last-name-special-format',
    category: 'Legal Last Name',
    validation: 'Legal Last Name rejects special characters',
    expected:
      'The Legal Last Name field should display "The value does not match the required format." for special-character input.',
  },
  {
    id: 'last-name-numeric-format',
    category: 'Legal Last Name',
    validation: 'Legal Last Name rejects numeric input',
    expected:
      'The Legal Last Name field should display "The value does not match the required format." for numeric input.',
  },
  {
    id: 'last-name-invalid-cleared',
    category: 'Legal Last Name',
    validation:
      'Legal Last Name returns to required validation after invalid input is cleared',
    expected:
      'After invalid Legal Last Name content is removed, the field should display "Please fill the required field".',
  },
  {
    id: 'suffix-dropdown-type',
    category: 'Suffix',
    validation: 'Suffix is a dropdown field',
    expected: 'The Suffix control should expose a single-selection listbox.',
  },
  {
    id: 'suffix-single-selection',
    category: 'Suffix',
    validation: 'Suffix permits one selected value',
    expected:
      'The Suffix dropdown should retain only one selected option at a time.',
  },
  {
    id: 'suffix-select-option',
    category: 'Suffix',
    validation: 'Suffix option can be selected',
    expected: 'An available Suffix option should be selectable.',
  },
  {
    id: 'suffix-selected-display',
    category: 'Suffix',
    validation: 'Selected Suffix value is displayed',
    expected:
      'The selected Suffix option should be displayed in the Suffix field.',
  },
  {
    id: 'suffix-change-selection',
    category: 'Suffix',
    validation: 'Suffix selection can be changed',
    expected: 'The user should be able to replace the selected Suffix option.',
  },
  {
    id: 'suffix-search',
    category: 'Suffix',
    validation: 'Suffix supports typed search',
    expected:
      'Typing a valid Suffix search should display its matching option.',
  },
  {
    id: 'suffix-no-options',
    category: 'Suffix',
    validation: 'Unavailable Suffix search displays No options',
    expected:
      'Typing an unavailable Suffix value should display the message "No options".',
  },
  {
    id: 'suffix-persistence',
    category: 'Suffix',
    validation: 'Updated Suffix persists after Next and Back',
    expected:
      'The last selected Suffix value should remain displayed after navigating to Page 2 and returning.',
  },
  {
    id: 'dob-datepicker',
    category: 'Date of Birth and Age',
    validation: 'Date of Birth field opens a date picker',
    expected: 'Clicking Date of Birth should display the date picker.',
  },
  {
    id: 'dob-valid-selection',
    category: 'Date of Birth and Age',
    validation: 'Valid Date of Birth can be selected or entered',
    expected: 'The Date of Birth field should accept a valid calendar date.',
  },
  {
    id: 'dob-future-rejected',
    category: 'Date of Birth and Age',
    validation: 'Future Date of Birth is rejected',
    expected:
      'A future Date of Birth should display "Date cannot be in the future.".',
  },
  {
    id: 'dob-over-maximum-age',
    category: 'Date of Birth and Age',
    validation: 'Date of Birth beyond age 150 is rejected',
    expected:
      'A Date of Birth producing an age greater than 150 should display "Please enter a valid date".',
  },
  {
    id: 'dob-invalid-format',
    category: 'Date of Birth and Age',
    validation: 'Incorrect Date of Birth format is rejected',
    expected:
      'An incorrectly formatted Date of Birth should display "Please enter valid date as per the format".',
  },
  {
    id: 'dob-format',
    category: 'Date of Birth and Age',
    validation: 'Date of Birth uses MM/DD/YYYY format',
    expected:
      'The Date of Birth field should accept and display dates in MM/DD/YYYY format.',
  },
  {
    id: 'age-zero-without-dob',
    category: 'Date of Birth and Age',
    validation: 'Age displays zero without Date of Birth',
    expected:
      'The disabled Age field should display zero while Date of Birth is empty.',
  },
  {
    id: 'dob-direct-entry',
    category: 'Date of Birth and Age',
    validation: 'Date of Birth supports direct typed entry',
    expected:
      'The user should be able to type a valid MM/DD/YYYY date directly into Date of Birth.',
  },
  {
    id: 'country-mandatory',
    category: 'Residential Country',
    validation: 'Residential Country is mandatory',
    expected: 'Country (Residential Country) should require a list selection.',
  },
  {
    id: 'country-options-order',
    category: 'Residential Country',
    validation: 'Country options are alphabetical after United States',
    expected:
      'United States of America should be first and the remaining displayed country options should be alphabetically ordered.',
  },
  {
    id: 'country-select-option',
    category: 'Residential Country',
    validation: 'Available country can be selected',
    expected:
      'An available country should be selectable from the Country dropdown.',
  },
  {
    id: 'country-single-selection',
    category: 'Residential Country',
    validation: 'Country permits one selected value',
    expected: 'The Country dropdown should retain only one selected value.',
  },
  {
    id: 'country-search',
    category: 'Residential Country',
    validation: 'Country supports typed search',
    expected: 'Typing a valid country name should display its matching option.',
  },
  {
    id: 'country-no-options',
    category: 'Residential Country',
    validation: 'Unavailable country search displays No options',
    expected:
      'Typing an unavailable country should display the message "No options".',
  },
  {
    id: 'other-country-mandatory',
    category: 'Other Country',
    validation: 'Other Country is mandatory when displayed',
    expected:
      'Other Country should be marked as required while Residential Country is Other.',
  },
  {
    id: 'other-country-required-message',
    category: 'Other Country',
    validation: 'Empty Other Country displays required message',
    expected:
      'Empty Other Country should display "Please fill the required field" when validation is triggered.',
  },
  {
    id: 'other-country-minimum',
    category: 'Other Country',
    validation: 'Other Country accepts one character',
    expected: 'Other Country should accept a one-character value.',
  },
  {
    id: 'other-country-maximum',
    category: 'Other Country',
    validation: 'Other Country enforces a 30-character maximum',
    expected: 'Other Country should retain no more than 30 characters.',
  },
  {
    id: 'other-country-spaces',
    category: 'Other Country',
    validation: 'Other Country accepts spaces',
    expected:
      'Other Country should accept a valid alphabetic country name containing spaces.',
  },
  {
    id: 'other-country-special-format',
    category: 'Other Country',
    validation: 'Other Country rejects special characters',
    expected:
      'Other Country should display "The value does not match the required format." for special-character input.',
  },
  {
    id: 'other-country-numeric-format',
    category: 'Other Country',
    validation: 'Other Country rejects numeric input',
    expected:
      'Other Country should display "The value does not match the required format." for numeric input.',
  },
  {
    id: 'other-country-invalid-cleared',
    category: 'Other Country',
    validation:
      'Other Country returns to required validation after invalid input is cleared',
    expected:
      'After invalid Other Country content is removed, the field should display "Please fill the required field".',
  },
  {
    id: 'country-empty-message',
    category: 'Residential Country',
    validation: 'Empty Country displays Choose from list',
    expected: 'An empty Country selection should display "Choose from list".',
  },
  {
    id: 'physical-address-text-required',
    category: 'Physical Address',
    validation: 'Physical Residential Address is a required textbox',
    expected:
      'Physical Residential Address should be a required text input and should identify that P.O. Boxes are not allowed.',
  },
  {
    id: 'physical-address-minimum',
    category: 'Physical Address',
    validation: 'Physical Residential Address accepts one character',
    expected:
      'Physical Residential Address should accept a one-character value.',
  },
  {
    id: 'physical-address-special-format',
    category: 'Physical Address',
    validation:
      'Physical Residential Address rejects unsupported special characters',
    expected:
      'Physical Residential Address should reject unsupported special-character-only input according to the stated requirement.',
  },
  {
    id: 'physical-address-po-box-rejected',
    category: 'Physical Address',
    validation: 'Physical Residential Address rejects P.O. Box input',
    expected:
      'Physical Residential Address should reject "P.O. Box 123" because the field explicitly states that it cannot be a P.O. Box.',
  },
  {
    id: 'physical-address-foreign-no-autofill',
    category: 'Physical Address Autofill',
    validation: 'Non-USA Physical Address does not show autofill',
    expected:
      'Physical Residential Address should behave as a plain textbox without address suggestions when Country is not United States.',
  },
  {
    id: 'physical-address-no-match',
    category: 'Physical Address Autofill',
    validation: 'Non-matching USA Physical Address shows no suggestions',
    expected:
      'A non-matching U.S. Physical Residential Address should not display an address suggestion list.',
  },
  {
    id: 'physical-address-prefill-editable',
    category: 'Physical Address Autofill',
    validation: 'Prefilled Physical Address dependent values remain editable',
    expected:
      'Apartment / Unit, City, State, and Zip Code should remain editable after address autofill.',
  },
  {
    id: 'apartment-optional-text',
    category: 'Apartment / Unit',
    validation: 'Apartment / Unit is an optional textbox',
    expected:
      'Apartment / Unit should be a text input that is not marked as required.',
  },
  {
    id: 'apartment-maximum',
    category: 'Apartment / Unit',
    validation: 'Apartment / Unit enforces a 12-character maximum',
    expected: 'Apartment / Unit should retain no more than 12 characters.',
  },
  {
    id: 'physical-city-mandatory',
    category: 'Physical City',
    validation: 'Physical City is mandatory',
    expected: 'Physical City should be marked as required.',
  },
  {
    id: 'physical-city-minimum',
    category: 'Physical City',
    validation: 'Physical City accepts one character',
    expected: 'Physical City should accept a one-character value.',
  },
  {
    id: 'physical-city-special-format',
    category: 'Physical City',
    validation: 'Physical City rejects special characters',
    expected:
      'Physical City should display "The value does not match the required format." for special-character input.',
  },
  {
    id: 'physical-city-invalid-cleared',
    category: 'Physical City',
    validation:
      'Physical City returns to required validation after invalid input is cleared',
    expected:
      'After invalid Physical City content is removed, the field should display "Please fill the required field".',
  },
  {
    id: 'physical-state-mandatory',
    category: 'Physical State / Territory',
    validation: 'Physical State is mandatory',
    expected: 'Physical U.S. State / Territory should require a selection.',
  },
  {
    id: 'physical-state-order',
    category: 'Physical State / Territory',
    validation: 'Physical State options are alphabetical',
    expected:
      'The U.S. State / Territory options read from the open dropdown should be alphabetically ordered.',
  },
  {
    id: 'physical-state-select',
    category: 'Physical State / Territory',
    validation: 'Physical State can be selected',
    expected: 'An available U.S. State / Territory should be selectable.',
  },
  {
    id: 'physical-state-single',
    category: 'Physical State / Territory',
    validation: 'Physical State permits one selected value',
    expected:
      'Physical U.S. State / Territory should retain only one selected value.',
  },
  {
    id: 'physical-state-search',
    category: 'Physical State / Territory',
    validation: 'Physical State supports typed search',
    expected:
      'Typing a valid state name should display its matching U.S. State / Territory option.',
  },
  {
    id: 'physical-state-no-options',
    category: 'Physical State / Territory',
    validation: 'Unavailable Physical State search displays No options',
    expected:
      'Typing an unavailable state should display the message "No options".',
  },
  {
    id: 'physical-zip-numeric-required',
    category: 'Physical Zip Code',
    validation: 'Physical Zip Code is a mandatory numeric field',
    expected:
      'Physical Zip Code should be required and should accept only a valid numeric ZIP value.',
  },
  {
    id: 'physical-zip-too-short',
    category: 'Physical Zip Code',
    validation: 'Physical Zip Code rejects fewer than five digits',
    expected:
      'A Physical Zip Code shorter than five digits should display "Minimum length should be 5 characters".',
  },
  {
    id: 'physical-zip-intermediate-length',
    category: 'Physical Zip Code',
    validation: 'Physical Zip Code rejects six through eight digits',
    expected:
      'A Physical Zip Code longer than five but shorter than nine digits should display "The value does not match the required format.".',
  },
  {
    id: 'physical-zip-five-digits',
    category: 'Physical Zip Code',
    validation: 'Physical Zip Code accepts five digits',
    expected: 'Physical Zip Code should accept a valid five-digit value.',
  },
  {
    id: 'physical-zip-nine-digits',
    category: 'Physical Zip Code',
    validation: 'Physical Zip Code accepts nine digits',
    expected:
      'Physical Zip Code should accept a valid nine-digit value, either as typed or reformatted by the application into the 5+4 form.',
  },
  {
    id: 'mailing-question-mandatory',
    category: 'Mailing Address Reflexive',
    validation: 'Mailing same-as-physical question is mandatory',
    expected:
      'The mailing-address-same-as-physical radio question should require an answer.',
  },
  {
    id: 'mailing-question-options',
    category: 'Mailing Address Reflexive',
    validation: 'Mailing same-as-physical question offers Yes and No',
    expected:
      'The mailing-address-same-as-physical question should display both Yes and No radio options.',
  },
  {
    id: 'mailing-question-required-message',
    category: 'Mailing Address Reflexive',
    validation: 'Unanswered mailing question displays required message',
    expected:
      'An unanswered mailing-address-same-as-physical question should display "Please fill the required field".',
  },
  {
    id: 'mailing-address-field-visible',
    category: 'U.S. Mailing Address Group',
    validation: 'Mailing Address field appears for No',
    expected:
      'The U.S. Mailing Address field should be displayed when No is selected.',
  },
  {
    id: 'mailing-address-required-message',
    category: 'U.S. Mailing Address',
    validation: 'Empty active Mailing Address displays required message',
    expected:
      'Empty U.S. Mailing Address should display "Please fill the required field" while the separate mailing-address path is active.',
  },
  {
    id: 'mailing-city-field-visible',
    category: 'U.S. Mailing Address Group',
    validation: 'Mailing City field appears for No',
    expected: 'The Mailing City field should be displayed when No is selected.',
  },
  {
    id: 'mailing-state-field-visible',
    category: 'U.S. Mailing Address Group',
    validation: 'Mailing State field appears for No',
    expected:
      'The Mailing U.S. State / Territory field should be displayed when No is selected.',
  },
  {
    id: 'mailing-zip-field-visible',
    category: 'U.S. Mailing Address Group',
    validation: 'Mailing Zip Code field appears for No',
    expected:
      'The Mailing Zip Code field should be displayed when No is selected.',
  },
  {
    id: 'mailing-address-no-match',
    category: 'Mailing Address Autofill',
    validation: 'Non-matching Mailing Address shows no suggestions',
    expected:
      'A non-matching U.S. Mailing Address should not display an address suggestion list.',
  },
  {
    id: 'mailing-address-prefill-editable',
    category: 'Mailing Address Autofill',
    validation: 'Prefilled Mailing Address dependent values remain editable',
    expected:
      'Mailing City, State, and Zip Code should remain editable after address autofill.',
  },
  {
    id: 'mailing-city-mandatory',
    category: 'Mailing City',
    validation: 'Mailing City is mandatory',
    expected:
      'Mailing City should be marked as required while mailing fields are active.',
  },
  {
    id: 'mailing-city-required-message',
    category: 'Mailing City',
    validation: 'Empty Mailing City displays required message',
    expected:
      'Empty Mailing City should display "Please fill the required field" when validation is triggered.',
  },
  {
    id: 'mailing-city-minimum',
    category: 'Mailing City',
    validation: 'Mailing City accepts one character',
    expected: 'Mailing City should accept a one-character value.',
  },
  {
    id: 'mailing-city-special-format',
    category: 'Mailing City',
    validation: 'Mailing City rejects special characters',
    expected:
      'Mailing City should display "The value does not match the required format." for special-character input.',
  },
  {
    id: 'mailing-city-invalid-cleared',
    category: 'Mailing City',
    validation:
      'Mailing City returns to required validation after invalid input is cleared',
    expected:
      'After invalid Mailing City content is removed, the field should display "Please fill the required field".',
  },
  {
    id: 'mailing-state-required-message',
    category: 'Mailing State / Territory',
    validation: 'Empty Mailing State displays required message',
    expected:
      'Empty Mailing U.S. State / Territory should display "Please fill the required field".',
  },
  {
    id: 'mailing-state-mandatory',
    category: 'Mailing State / Territory',
    validation: 'Mailing State is mandatory',
    expected:
      'Mailing U.S. State / Territory should require a selection while mailing fields are active.',
  },
  {
    id: 'mailing-state-order',
    category: 'Mailing State / Territory',
    validation: 'Mailing State options are alphabetical',
    expected:
      'The Mailing U.S. State / Territory options read from the open dropdown should be alphabetically ordered.',
  },
  {
    id: 'mailing-state-select',
    category: 'Mailing State / Territory',
    validation: 'Mailing State can be selected',
    expected:
      'An available Mailing U.S. State / Territory should be selectable.',
  },
  {
    id: 'mailing-state-single',
    category: 'Mailing State / Territory',
    validation: 'Mailing State permits one selected value',
    expected:
      'Mailing U.S. State / Territory should retain only one selected value.',
  },
  {
    id: 'mailing-state-search',
    category: 'Mailing State / Territory',
    validation: 'Mailing State supports typed search',
    expected:
      'Typing a valid state name should display its matching Mailing State option.',
  },
  {
    id: 'mailing-state-no-options',
    category: 'Mailing State / Territory',
    validation: 'Unavailable Mailing State search displays No options',
    expected:
      'Typing an unavailable Mailing State should display the message "No options".',
  },
  {
    id: 'mailing-zip-numeric-required',
    category: 'Mailing Zip Code',
    validation: 'Mailing Zip Code is a mandatory numeric field',
    expected:
      'Mailing Zip Code should be required and should accept only a valid numeric ZIP value.',
  },
  {
    id: 'mailing-zip-required-message',
    category: 'Mailing Zip Code',
    validation: 'Empty Mailing Zip Code displays required message',
    expected:
      'Empty Mailing Zip Code should display "Please fill the required field".',
  },
  {
    id: 'mailing-zip-too-short',
    category: 'Mailing Zip Code',
    validation: 'Mailing Zip Code rejects fewer than five digits',
    expected:
      'A Mailing Zip Code shorter than five digits should display "Minimum length should be 5 characters".',
  },
  {
    id: 'mailing-zip-intermediate-length',
    category: 'Mailing Zip Code',
    validation: 'Mailing Zip Code rejects six through eight digits',
    expected:
      'A Mailing Zip Code longer than five but shorter than nine digits should display "The value does not match the required format.".',
  },
  {
    id: 'mailing-zip-five-digits',
    category: 'Mailing Zip Code',
    validation: 'Mailing Zip Code accepts five digits',
    expected: 'Mailing Zip Code should accept a valid five-digit value.',
  },
  {
    id: 'mailing-zip-nine-digits',
    category: 'Mailing Zip Code',
    validation: 'Mailing Zip Code accepts nine digits',
    expected:
      'Mailing Zip Code should accept a valid nine-digit value, either as typed or reformatted by the application into the 5+4 form.',
  },
  {
    id: 'mandatory-mailing-blocks-next',
    category: 'Page Navigation',
    validation: 'Missing active Mailing Address values block Next',
    expected:
      'The application should remain on Page 1 when active required Mailing Address fields are unanswered.',
  },
  {
    id: 'optional-fields-do-not-block-next',
    category: 'Page Navigation',
    validation: 'Empty optional fields do not block Next',
    expected:
      'The application should advance with valid required values while optional Middle Name and Apartment / Unit are empty.',
  },
  {
    id: 'back-returns-page1',
    category: 'Page Navigation',
    validation: 'Back returns from Page 2 to Page 1',
    expected: 'Clicking Back on Page 2 should return to Page 1 of 2.',
  },
  {
    id: 'updated-values-persist',
    category: 'Persistence',
    validation: 'Updated values persist across a second Next and Back cycle',
    expected:
      'Values modified after returning to Page 1 should persist after navigating to Page 2 and back again.',
  },
  {
    id: 'persist-middle-name',
    category: 'Persistence',
    validation: 'Middle Name retained after returning from Page 2',
    expected:
      'The Middle Name entered before navigating forward should still be displayed after returning to Page 1.',
  },
  {
    id: 'persist-apartment-unit',
    category: 'Persistence',
    validation: 'Apartment / Unit retained after returning from Page 2',
    expected:
      'The Apartment / Unit entered before navigating forward should still be displayed after returning to Page 1.',
  },
  {
    id: 'persist-physical-city',
    category: 'Persistence',
    validation: 'Physical City retained after returning from Page 2',
    expected:
      'The Physical City entered before navigating forward should still be displayed after returning to Page 1.',
  },
  {
    id: 'persist-country',
    category: 'Persistence',
    validation: 'Residential Country retained after returning from Page 2',
    expected:
      'The selected Residential Country should still be displayed after returning to Page 1.',
  },
  {
    id: 'persist-mailing-choice',
    category: 'Persistence',
    validation:
      'Mailing same-as-physical answer retained after returning from Page 2',
    expected:
      'The selected mailing-address-same-as-physical answer should remain selected after returning to Page 1.',
  },
] as const;

export const PI_PAGE1_VALIDATIONS = [
  ...EXISTING_PI_PAGE1_VALIDATIONS,
  ...EXPANDED_PI_PAGE1_VALIDATIONS,
] as const;

export type PiPage1ValidationId = (typeof PI_PAGE1_VALIDATIONS)[number]['id'];

export function buildPiPage1MatrixTitle(applicationState: string): string {
  return `Proposed Primary Insured Page 1 – ${applicationState.trim()}`;
}

const NOT_EXECUTED_ACTUAL =
  'This validation was not executed because the scenario stopped before this validation was reached.';

export function suffixOptionValidationId(suffix: string): PiPage1ValidationId {
  return `suffix-option-${suffix.trim().toLowerCase()}` as PiPage1ValidationId;
}

interface PiPage1Outcome {
  actual: string;
  result: PiPage1ValidationResult;
}

/**
 * Builds the detailed PI Page 1 validation matrix. Validations that are
 * never recorded stay in the matrix as NOT EXECUTED so the summary always
 * reconciles to the full baseline.
 */
export class PiPage1ValidationMatrix {
  private readonly catalog = PI_PAGE1_VALIDATIONS;
  private readonly outcomes = new Map<PiPage1ValidationId, PiPage1Outcome>();

  constructor() {
    const validationIds = this.catalog.map((validation) => validation.id);
    if (new Set(validationIds).size !== validationIds.length) {
      throw new Error(
        'PI Page 1 validation catalog contains duplicate validation ids.',
      );
    }
  }

  reset(): void {
    this.outcomes.clear();
  }

  record(
    id: PiPage1ValidationId,
    result: PiPage1ValidationResult,
    actual: string,
  ): void {
    if (!this.catalog.some((planned) => planned.id === id)) {
      throw new Error(
        `PI Page 1 validation "${id}" is not registered in the validation catalog.`,
      );
    }
    this.outcomes.set(id, { result, actual });
  }

  markNotExecuted(id: PiPage1ValidationId, reason: string): void {
    this.record(id, 'NOT EXECUTED', reason);
  }

  markNotApplicable(id: PiPage1ValidationId, reason: string): void {
    this.record(id, 'N/A', reason);
  }

  buildRows(): PiPage1ValidationRow[] {
    return this.catalog.map((planned) => {
      const outcome = this.outcomes.get(planned.id);
      return {
        id: planned.id,
        category: planned.category,
        validation: planned.validation,
        expected: planned.expected,
        actual: outcome?.actual ?? NOT_EXECUTED_ACTUAL,
        result: outcome?.result ?? 'NOT EXECUTED',
      };
    });
  }

  getSummary(): {
    total: number;
    pass: number;
    fail: number;
    na: number;
    notExecuted: number;
  } {
    const rows = this.buildRows();
    const total = rows.length;
    const count = (result: PiPage1ValidationResult): number =>
      rows.filter((row) => row.result === result).length;

    return {
      total,
      pass: count('PASS'),
      fail: count('FAIL'),
      na: count('N/A'),
      notExecuted: count('NOT EXECUTED'),
    };
  }

  buildHtml(flowLabel: string, matrixTitle: string): string {
    const summary = this.getSummary();
    const rowsHtml = this.buildRows()
      .map((row, index) => renderRow(index + 1, row))
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(matrixTitle)}</title>
<style>
  body { font-family: Segoe UI, Arial, sans-serif; margin: 20px; color: #1f2937; background: #ffffff; }
  h1 { font-size: 1.35rem; margin: 0 0 12px 0; color: #111827; }
  .summary { margin: 0 0 18px 0; padding: 12px 14px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; }
  .summary p { margin: 4px 0; font-size: 0.95rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  th, td { border: 1px solid #d1d5db; padding: 8px 10px; vertical-align: top; text-align: left; }
  th { background: #e5e7eb; font-weight: 600; }
  tr:nth-child(even) td { background: #f9fafb; }
  .pass { color: #166534; font-weight: 600; white-space: nowrap; }
  .fail { color: #b91c1c; font-weight: 600; white-space: nowrap; background: #fef2f2; }
  .na { color: #92400e; font-weight: 600; white-space: nowrap; background: #fffbeb; }
  .not-executed { color: #7c2d12; font-weight: 600; white-space: nowrap; background: #fff7ed; }
  td.num { text-align: center; width: 42px; }
  td.category { width: 170px; font-weight: 500; }
  td.result { width: 110px; }
</style>
</head>
<body>
<h1>${escapeHtml(matrixTitle)}</h1>
<div class="summary">
  <p><strong>Flow:</strong> ${escapeHtml(flowLabel)}</p>
  <p><strong>Implemented Validations:</strong> ${summary.total}</p>
  <p><strong>PASS:</strong> ${summary.pass}</p>
  <p><strong>FAIL:</strong> ${summary.fail}</p>
  <p><strong>N/A:</strong> ${summary.na}</p>
  <p><strong>NOT EXECUTED:</strong> ${summary.notExecuted}</p>
  <p><strong>Total:</strong> ${summary.pass + summary.fail + summary.na + summary.notExecuted}</p>
</div>
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Category</th>
      <th>Validation</th>
      <th>Expected</th>
      <th>Actual</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
${rowsHtml}
  </tbody>
</table>
</body>
</html>`;
  }

  async attach(
    attach: CucumberAttach,
    flowLabel: string,
    matrixTitle: string,
  ): Promise<void> {
    const summary = this.getSummary();
    await attach(this.buildHtml(flowLabel, matrixTitle), 'text/html');
    await attach(
      `${matrixTitle} — ${flowLabel} | PASS ${summary.pass} | FAIL ${summary.fail} | N/A ${summary.na} | NOT EXECUTED ${summary.notExecuted} | Total ${summary.total}`,
      'text/plain',
    );
  }
}

function renderRow(index: number, row: PiPage1ValidationRow): string {
  const resultClass =
    row.result === 'PASS'
      ? 'pass'
      : row.result === 'N/A'
        ? 'na'
        : row.result === 'NOT EXECUTED'
          ? 'not-executed'
          : 'fail';
  const resultLabel =
    row.result === 'PASS'
      ? '✅ PASS'
      : row.result === 'N/A'
        ? '➖ N/A'
        : row.result === 'NOT EXECUTED'
          ? '⏸ NOT EXECUTED'
          : '❌ FAIL';

  return `    <tr>
      <td class="num">${index}</td>
      <td class="category">${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.validation)}</td>
      <td>${escapeHtml(row.expected)}</td>
      <td>${escapeHtml(row.actual)}</td>
      <td class="result ${resultClass}">${resultLabel}</td>
    </tr>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
