import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { getEnvironmentConfig } from '../config/environment.config';
import { ProposedPrimaryInsuredPage1Locators } from '../locators/ProposedPrimaryInsuredPage1Locators';
import {
  PiPage1Field,
  ProposedPrimaryInsuredPage1Data,
  ProposedPrimaryInsuredPage1TestData,
} from '../utils/proposed-primary-insured/ProposedPrimaryInsuredPage1Data';

export type PiCountry = 'usa' | 'canada' | 'other';

export class ProposedPrimaryInsuredPage1Page extends BasePage {
  private readonly locators: ProposedPrimaryInsuredPage1Locators;
  private data!: ProposedPrimaryInsuredPage1TestData;

  constructor(page: Page) {
    super(page, 'ProposedPrimaryInsuredPage1Page');
    this.locators = new ProposedPrimaryInsuredPage1Locators(page);
  }

  configureForState(stateName: string): void {
    this.data = ProposedPrimaryInsuredPage1Data.buildForState(stateName);
  }

  getLocators(): ProposedPrimaryInsuredPage1Locators {
    return this.locators;
  }

  getData(): ProposedPrimaryInsuredPage1TestData {
    return this.data;
  }

  async waitForReady(): Promise<void> {
    await expect(this.input(this.data.fields.legalFirstName)).toBeVisible({
      timeout: getEnvironmentConfig().navigationTimeout,
    });
    await expect(this.locators.page1Indicator).toBeVisible();
  }

  input(field: PiPage1Field): Locator {
    return this.locators.fieldInput(field.type, field.fieldId);
  }

  dropdown(field: PiPage1Field): Locator {
    return this.locators.dropdownTrigger(field.fieldId);
  }

  error(field: PiPage1Field): Locator {
    return this.locators.fieldError(field.type, field.fieldId).first();
  }

  fieldContainer(field: PiPage1Field): Locator {
    return this.locators.fieldContainer(field.type, field.fieldId);
  }

  async fill(field: PiPage1Field, value: string): Promise<void> {
    await this.input(field).fill(value);
  }

  async clear(field: PiPage1Field): Promise<void> {
    await this.input(field).fill('');
  }

  async enterDateOfBirth(value: string): Promise<void> {
    const dob = this.input(this.data.fields.dateOfBirth);
    await dob.fill(value);

    if (await this.locators.datePickerPopover.first().isVisible()) {
      await dob.press('Escape');
    }
    await dob.blur();
  }

  async selectDropdown(
    field: PiPage1Field,
    optionLabel: string,
  ): Promise<void> {
    const trigger = this.dropdown(field);
    if (new RegExp(optionLabel, 'i').test(await trigger.inputValue())) {
      return;
    }

    await this.closeListboxIfOpen();
    await trigger.click();
    await trigger.fill(optionLabel.slice(0, 3));
    const option = this.locators.dropdownOption(optionLabel);
    await expect(option).toBeVisible();
    await option.click();
    await expect(trigger).toHaveValue(new RegExp(optionLabel, 'i'));
  }

  async openDropdown(field: PiPage1Field): Promise<void> {
    await this.closeListboxIfOpen();
    await this.dropdown(field).click();
    await expect(this.locators.openListbox).toBeVisible();
  }

  async searchDropdown(field: PiPage1Field, searchText: string): Promise<void> {
    await this.openDropdown(field);
    await this.dropdown(field).fill(searchText);
  }

  async getOpenDropdownOptions(): Promise<string[]> {
    return (await this.locators.visibleDropdownOptions.allTextContents())
      .map((option) => option.trim())
      .filter(Boolean);
  }

  async closeOpenDropdown(): Promise<void> {
    await this.closeListboxIfOpen();
  }

  async clearDropdown(field: PiPage1Field): Promise<void> {
    const trigger = this.dropdown(field);
    await trigger.fill('');
    await trigger.blur();
  }

  async selectCountry(country: PiCountry): Promise<void> {
    if (await this.isCountryStateActive(country)) {
      return;
    }

    const labels = this.data.country;
    const label = labels[country];
    const trigger = this.dropdown(this.data.fields.country);
    await this.closeListboxIfOpen();
    await trigger.click();
    const option = this.locators.dropdownOption(label);
    await expect(option).toBeVisible();
    await option.click();

    if (await this.locators.openListbox.isVisible()) {
      await expect(this.locators.openListbox).toBeHidden();
    }

    await this.waitForCountryState(country);
  }

  async isOnPage1(): Promise<boolean> {
    return this.input(this.data.fields.legalFirstName).isVisible();
  }

  async isOnPage2(): Promise<boolean> {
    if (await this.isOnPage1()) {
      return false;
    }
    return this.locators.page2Indicator.isVisible();
  }

  async waitForPage2(timeout = 15_000): Promise<boolean> {
    try {
      await this.locators.page2Indicator.waitFor({ state: 'visible', timeout });
    } catch {
      return false;
    }
    return !(await this.isOnPage1());
  }

  async returnToPage1(): Promise<void> {
    if (await this.isOnPage1()) {
      return;
    }

    // Back is also present on Page 1, so it is only safe once Page 2 is
    // confirmed; otherwise the left navigation reopens Page 1 directly.
    if (await this.isOnPage2()) {
      await this.clickBack();
    } else {
      await this.openProposedPrimaryInsuredDetails();
    }

    await expect(this.input(this.data.fields.legalFirstName)).toBeVisible();
  }

  async fillValidForm(): Promise<void> {
    const fields = this.data.fields;
    const valid = this.data.valid;

    await this.returnToPage1();
    await this.selectCountry('usa');
    await this.fill(fields.legalFirstName, valid.legalFirstName);
    await this.fill(fields.middleName, valid.middleName);
    await this.fill(fields.legalLastName, valid.legalLastName);
    await this.enterDateOfBirth(valid.dateOfBirth);
    await this.fill(fields.physicalAddress, valid.physicalAddress);
    await this.fill(fields.apartmentUnit, valid.apartmentUnit);
    await this.fill(fields.city, valid.city);
    await this.selectDropdown(fields.usStateTerritory, valid.state);
    await this.fill(fields.zipCode, valid.zipCode);
    await this.selectMailingSameAsPhysical('yes');
  }

  async selectMailingSameAsPhysical(option: 'yes' | 'no'): Promise<void> {
    const fieldId = this.data.fields.mailingSameAsPhysical.fieldId;
    await this.locators.mailingSameQuestion.scrollIntoViewIfNeeded();
    const input = this.locators.radioInput(fieldId, option);
    if (await input.isChecked()) {
      return;
    }
    await this.locators.radioOption(fieldId, option).scrollIntoViewIfNeeded();
    await this.locators.radioOption(fieldId, option).click();
    await expect(input).toBeChecked();
  }

  async toggleProposedPrimaryInsuredSection(): Promise<void> {
    await this.locators.proposedPrimaryInsuredToggle.click();
  }

  async openProposedPrimaryInsuredDetails(): Promise<void> {
    if (
      (await this.locators.proposedPrimaryInsuredToggle.getAttribute(
        'aria-expanded',
      )) !== 'true'
    ) {
      await this.toggleProposedPrimaryInsuredSection();
    }
    await this.locators.proposedPrimaryInsuredDetailsLink.click();
    await expect(this.locators.page1Indicator).toBeVisible();
  }

  async openMilitary(): Promise<void> {
    if (
      (await this.locators.proposedPrimaryInsuredToggle.getAttribute(
        'aria-expanded',
      )) !== 'true'
    ) {
      await this.toggleProposedPrimaryInsuredSection();
    }
    await this.locators.militaryLink.click();
    await expect(this.locators.militaryPageIndicator).toBeVisible();
  }

  async fillValidMailingAddress(): Promise<void> {
    const fields = this.data.fields;
    const valid = this.data.valid;
    await this.selectMailingSameAsPhysical('no');
    await expect(this.input(fields.mailingAddress)).toBeVisible();
    await this.fill(fields.mailingAddress, valid.mailingAddress);
    await this.fill(fields.mailingCity, valid.mailingCity);
    await this.selectDropdown(fields.mailingStateTerritory, valid.mailingState);
    await this.fill(fields.mailingZipCode, valid.mailingZipCode);
  }

  async clickNext(): Promise<void> {
    await this.locators.nextButton.scrollIntoViewIfNeeded();
    await this.locators.nextButton.click();
  }

  async clickBack(): Promise<void> {
    await this.locators.backButton.click();
  }

  private async closeListboxIfOpen(): Promise<void> {
    if (!(await this.locators.openListbox.isVisible())) {
      return;
    }
    await this.page.keyboard.press('Escape');
    if (await this.locators.openListbox.isVisible()) {
      await expect(this.locators.openListbox).toBeHidden();
    }
  }

  private async isCountryStateActive(country: PiCountry): Promise<boolean> {
    const fields = this.data.fields;
    const selectedCountry = await this.dropdown(fields.country).inputValue();
    const expectedCountry = this.data.country[country];
    if (!new RegExp(`^${expectedCountry}$`, 'i').test(selectedCountry)) {
      return false;
    }
    const usaStateVisible = await this.dropdown(
      fields.usStateTerritory,
    ).isVisible();
    const usaZipVisible = await this.input(fields.zipCode).isVisible();
    const otherVisible = await this.input(fields.otherCountry).isVisible();
    const foreignStateVisible =
      await this.locators.foreignStateInput.isVisible();
    const foreignPostalVisible =
      await this.locators.foreignPostalCodeInput.isVisible();

    if (country === 'usa') {
      return usaStateVisible && usaZipVisible && !otherVisible;
    }
    if (country === 'canada') {
      return (
        !usaStateVisible &&
        !usaZipVisible &&
        !otherVisible &&
        foreignStateVisible &&
        foreignPostalVisible
      );
    }
    return otherVisible && !usaStateVisible && !usaZipVisible;
  }

  private async waitForCountryState(country: PiCountry): Promise<void> {
    const fields = this.data.fields;
    if (country === 'usa') {
      await expect(this.dropdown(fields.usStateTerritory)).toBeVisible();
      await expect(this.input(fields.zipCode)).toBeVisible();
      await expect(this.input(fields.otherCountry)).toBeHidden();
      return;
    }

    await expect(this.dropdown(fields.usStateTerritory)).toBeHidden();
    await expect(this.input(fields.zipCode)).toBeHidden();
    await expect(this.locators.foreignStateInput).toBeVisible();
    await expect(this.locators.foreignPostalCodeInput).toBeVisible();
    if (country === 'other') {
      await expect(this.input(fields.otherCountry)).toBeVisible();
    } else {
      await expect(this.input(fields.otherCountry)).toBeHidden();
    }
  }
}
