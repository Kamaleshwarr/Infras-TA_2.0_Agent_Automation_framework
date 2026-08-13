import { expect, Page } from '@playwright/test';
import { getEnvironmentConfig } from '../config/environment.config';
import { BasePage } from '../base/BasePage';
import { LicensingLocators } from '../locators/LicensingLocators';
import {
  LicensingFieldDefinition,
  LicensingFlowResolver,
  LicensingTestData,
  SplitAgentData,
} from '../utils/licensing/LicensingFlowResolver';

export type { SplitAgentData };

/**
 * Term Life Application Form — Licensing module actions.
 */
export class LicensingPage extends BasePage {
  private readonly locators: LicensingLocators;
  private readonly testData: LicensingTestData;

  constructor(page: Page) {
    super(page, 'LicensingPage');
    this.locators = new LicensingLocators(page);
    this.testData = LicensingFlowResolver.getTestData();
  }

  async waitForLicensingModuleReady(): Promise<void> {
    const navigationTimeout = getEnvironmentConfig().navigationTimeout;
    await this.actions.waitForVisibleWithTimeout(
      this.locators.fieldInput('text', '40127'),
      'Writing Agent First Name field',
      navigationTimeout,
    );
  }

  async navigateToLicensingModule(): Promise<void> {
    this.logger.info('Navigating to Licensing module');
    await this.actions.waitForVisible(
      this.locators.licensingSectionLink,
      'Licensing section link',
    );
    await this.actions.click(
      this.locators.licensingSectionLink,
      'Licensing section link',
    );
    await this.waitForLicensingModuleReady();
    await this.actions.waitForVisible(
      this.locators.agentInformationHeading,
      'Agent Information heading',
    );
  }

  async fillField(
    field: LicensingFieldDefinition,
    value: string,
  ): Promise<void> {
    await this.actions.fill(
      this.locators.fieldInput(field.type, field.fieldId),
      value,
      field.label,
    );
  }

  async fillValidLicensingCore(includeLicenseNumber: boolean): Promise<void> {
    const samples = this.testData.validSamples;
    const fields = this.testData.fields;

    await this.fillField(
      fields.writingAgentFirstName,
      samples.writingAgentFirstName,
    );
    await this.fillField(
      fields.writingAgentLastName,
      samples.writingAgentLastName,
    );
    await this.fillField(fields.officeId, samples.officeId);
    await this.fillField(fields.agentEmail, samples.agentEmail);
    await this.fillField(fields.phoneNumber, samples.phoneNumber);
    await this.selectAdditionalAgents('no');

    if (includeLicenseNumber) {
      await this.fillField(fields.licenseNumber, samples.licenseNumber);
    }
  }

  async fillCompleteValidLicensing(
    includeLicenseNumber: boolean,
    includeAgentAddress: boolean,
    stateName?: string,
  ): Promise<void> {
    await this.fillValidLicensingCore(includeLicenseNumber);
    if (includeAgentAddress) {
      await this.fillValidAgentAddress(stateName);
    }
  }

  async fillValidAgentAddress(stateName?: string): Promise<void> {
    const fields = this.testData.agentAddressFields;
    const samples =
      (stateName && this.testData.validAddressSamplesByState[stateName]) ||
      this.testData.validAddressSamples;

    await this.selectDropdownOption(fields.country.fieldId, samples.country);
    await this.fillFieldById(fields.addressLine1, samples.addressLine1);
    await this.fillFieldById(fields.apartmentUnit, samples.apartmentUnit);
    await this.fillFieldById(fields.city, samples.city);
    await this.selectDropdownOption(
      fields.stateTerritory.fieldId,
      samples.stateTerritory,
    );
    await this.fillFieldById(fields.zipCode, samples.zipCode);
  }

  private async fillFieldById(
    field: { fieldId: string; type: string; label: string },
    value: string,
  ): Promise<void> {
    await this.actions.fill(
      this.page.getByTestId(
        `agp-form-field-${field.type}-${field.fieldId}-input`,
      ),
      value,
      field.label,
    );
  }

  private mainAgentPercentInput() {
    return this.locators.fieldInput(
      this.testData.fields.agentPercent.type,
      this.testData.fields.agentPercent.fieldId,
    );
  }

  private actionTimeoutMs(): number {
    return getEnvironmentConfig().actionTimeout;
  }

  private async selectDropdownOption(
    fieldId: string,
    optionLabel: string,
  ): Promise<void> {
    const trigger = this.page.getByTestId(
      `agp-form-field-dropdown-${fieldId}-trigger`,
    );
    await this.actions.click(trigger, `Dropdown trigger ${fieldId}`);
    const option = this.page
      .getByRole('option', { name: new RegExp(optionLabel, 'i') })
      .first();
    await option.waitFor({ state: 'visible', timeout: this.actionTimeoutMs() });
    await this.actions.click(option, `Dropdown option ${optionLabel}`);
    // MUI combobox stores the selection on the trigger input's value, not text content.
    await expect(trigger).toHaveValue(new RegExp(optionLabel, 'i'), {
      timeout: this.actionTimeoutMs(),
    });
  }

  async selectAdditionalAgents(option: 'yes' | 'no'): Promise<void> {
    await this.actions.click(
      this.locators.radioswitchOption(
        this.testData.fields.anyAdditionalAgents.fieldId,
        option,
      ),
      `Any Additional Agents ${option}`,
    );

    if (option === 'yes') {
      await expect(this.locators.splitAgentCardListRoot).toBeVisible({
        timeout: this.actionTimeoutMs(),
      });
      await expect(this.locators.splitAgentAddButton).toBeVisible({
        timeout: this.actionTimeoutMs(),
      });
      return;
    }

    await expect(this.locators.splitAgentAddButton).toBeHidden({
      timeout: this.actionTimeoutMs(),
    });
  }

  async clickPrimaryNext(): Promise<void> {
    await this.actions.click(
      this.locators.primaryNextButton,
      'Licensing Next button',
    );
  }

  async navigateToProposedPrimaryInsuredSection(): Promise<void> {
    await this.actions.click(
      this.locators.proposedPrimaryInsuredSectionLink,
      'Proposed Primary Insured section link',
    );
    await this.page.waitForLoadState('domcontentloaded', {
      timeout: getEnvironmentConfig().navigationTimeout,
    });
  }

  async returnToApplications(): Promise<void> {
    const navigationTimeout = getEnvironmentConfig().navigationTimeout;
    await this.actions.click(
      this.locators.returnToApplicationsButton,
      'Return to Applications button',
    );
    await this.actions.waitForVisibleWithTimeout(
      this.page.getByRole('heading', { name: /^Applications$/i }),
      'Applications page heading',
      navigationTimeout,
    );
  }

  async openSplitAgentModal(): Promise<void> {
    await this.actions.click(
      this.locators.splitAgentAddButton,
      'Split Agent Add New button',
    );
    await this.locators.splitAgentModal.waitFor({
      state: 'visible',
      timeout: this.actionTimeoutMs(),
    });
  }

  async fillSplitAgentModal(
    data: SplitAgentData,
    includeSplitLicense = false,
  ): Promise<void> {
    const fields = this.testData.splitAgentFields;
    await this.actions.fill(
      this.locators.splitAgentModalField(fields.firstName.suffix),
      data.firstName,
      fields.firstName.label,
    );
    await this.actions.fill(
      this.locators.splitAgentModalField(fields.lastName.suffix),
      data.lastName,
      fields.lastName.label,
    );
    await this.actions.fill(
      this.locators.splitAgentModalField(fields.agentNumber.suffix),
      data.agentNumber,
      fields.agentNumber.label,
    );
    if (includeSplitLicense && data.licenseNumber) {
      await this.actions.fill(
        this.locators.splitAgentModalField(fields.licenseNumber.suffix),
        data.licenseNumber,
        fields.licenseNumber.label,
      );
    }
    await this.actions.fill(
      this.locators.splitAgentModalField(fields.percent.suffix),
      data.percent,
      fields.percent.label,
    );
  }

  async saveSplitAgentModal(expectedRowCount?: number): Promise<void> {
    await this.actions.click(
      this.locators.splitAgentModalSaveButton,
      'Split Agent Save button',
    );

    if (expectedRowCount !== undefined) {
      await this.waitForSplitAgentRowCount(expectedRowCount);
      await this.waitForSplitAgentModalHidden();
      return;
    }

    const validationMessage = this.page
      .getByText(this.testData.validationMessages.requiredField, {
        exact: false,
      })
      .first();
    const totalPercentMessage = this.page
      .getByText(this.testData.validationMessages.totalPercentMustEqual100, {
        exact: false,
      })
      .first();

    await Promise.race([
      this.locators.splitAgentModal.waitFor({
        state: 'hidden',
        timeout: this.actionTimeoutMs(),
      }),
      validationMessage.waitFor({
        state: 'visible',
        timeout: this.actionTimeoutMs(),
      }),
      totalPercentMessage.waitFor({
        state: 'visible',
        timeout: this.actionTimeoutMs(),
      }),
    ]).catch(() => undefined);
  }

  async cancelSplitAgentModal(): Promise<void> {
    await this.actions.click(
      this.locators.splitAgentModalCancelButton,
      'Split Agent Cancel button',
    );
    await this.waitForSplitAgentModalHidden();
  }

  async openSplitAgentEditModal(index: number): Promise<void> {
    await this.actions.click(
      this.locators.splitAgentEditButton(index),
      `Split Agent edit row ${index}`,
    );
    await this.locators.splitAgentModal.waitFor({
      state: 'visible',
      timeout: this.actionTimeoutMs(),
    });
  }

  async getSplitAgentModalFieldValue(suffix: string): Promise<string> {
    return this.locators.splitAgentModalField(suffix).inputValue();
  }

  async setSplitAgentModalFieldValue(
    suffix: string,
    value: string,
  ): Promise<void> {
    await this.locators.splitAgentModalField(suffix).fill(value);
  }

  async getSplitAgentCardListText(): Promise<string> {
    return (
      (await this.locators.splitAgentCardListRoot.textContent()) ?? ''
    ).trim();
  }

  async isLicensingModuleDisplayed(): Promise<boolean> {
    return this.locators.agentInformationHeading.isVisible();
  }

  async isPrimaryNextEnabled(): Promise<boolean> {
    return this.locators.primaryNextButton.isEnabled();
  }

  async attemptClickSplitAgentAdd(): Promise<boolean> {
    const addButton = this.locators.splitAgentAddButton;
    if (!(await addButton.isVisible())) {
      return false;
    }
    await addButton.click({ timeout: 3000 }).catch(() => undefined);
    return true;
  }

  async cancelSplitAgentModalIfOpen(): Promise<boolean> {
    if (!(await this.isSplitAgentModalOpen())) {
      return false;
    }
    await this.cancelSplitAgentModal();
    return true;
  }

  async dismissSplitAgentModalIfOpen(): Promise<void> {
    await this.cancelSplitAgentModalIfOpen();
  }

  async ensureLicensingModuleActive(): Promise<void> {
    if (await this.isLicensingModuleDisplayed()) {
      await this.waitForLicensingModuleReady();
      return;
    }
    await this.navigateToLicensingModule();
  }

  async requireMainAgentPercent(
    expected: string,
    timeoutMs = getEnvironmentConfig().actionTimeout,
  ): Promise<void> {
    await expect(this.mainAgentPercentInput()).toHaveValue(expected, {
      timeout: timeoutMs,
    });
  }

  async waitForSplitAgentRowCount(
    expected: number,
    timeoutMs = getEnvironmentConfig().actionTimeout,
  ): Promise<void> {
    await expect(this.locators.splitAgentRowEditButtons()).toHaveCount(
      expected,
      {
        timeout: timeoutMs,
      },
    );
  }

  async isSplitAgentModalOpen(): Promise<boolean> {
    return this.locators.splitAgentModal.isVisible().catch(() => false);
  }

  async waitForSplitAgentModalHidden(
    timeoutMs = getEnvironmentConfig().actionTimeout,
  ): Promise<void> {
    await this.locators.splitAgentModal.waitFor({
      state: 'hidden',
      timeout: timeoutMs,
    });
  }

  async readSplitAgentFieldFromEditModal(
    index: number,
    fieldSuffix: string,
  ): Promise<string> {
    await this.openSplitAgentEditModal(index);
    const value = await this.getSplitAgentModalFieldValue(fieldSuffix);
    await this.cancelSplitAgentModal();
    return value;
  }

  async readSplitAgentFieldsFromEditModal(
    index: number,
    fieldSuffixes: string[],
  ): Promise<Record<string, string>> {
    await this.openSplitAgentEditModal(index);
    const values: Record<string, string> = {};
    for (const suffix of fieldSuffixes) {
      values[suffix] = await this.getSplitAgentModalFieldValue(suffix);
    }
    await this.cancelSplitAgentModal();
    return values;
  }

  async getSplitAgentSavedValues(index: number): Promise<SplitAgentData> {
    const fields = this.testData.splitAgentFields;
    const suffixes = [
      fields.firstName.suffix,
      fields.lastName.suffix,
      fields.agentNumber.suffix,
      fields.percent.suffix,
    ];
    if (this.testData.fields.licenseNumber) {
      suffixes.push(fields.licenseNumber.suffix);
    }

    const read = await this.readSplitAgentFieldsFromEditModal(index, suffixes);
    const values: SplitAgentData = {
      firstName: read[fields.firstName.suffix],
      lastName: read[fields.lastName.suffix],
      agentNumber: read[fields.agentNumber.suffix],
      percent: read[fields.percent.suffix],
    };
    if (this.testData.fields.licenseNumber) {
      const licenseValue = read[fields.licenseNumber.suffix];
      if (licenseValue) {
        values.licenseNumber = licenseValue;
      }
    }
    return values;
  }

  async saveSplitAgentModalExpectingTotalPercentError(): Promise<
    'validation_error' | 'modal_closed'
  > {
    await this.actions.click(
      this.locators.splitAgentModalSaveButton,
      'Split Agent Save button',
    );

    const totalPercentMessage = this.page
      .getByText(this.testData.validationMessages.totalPercentMustEqual100, {
        exact: false,
      })
      .first();

    return Promise.race([
      totalPercentMessage
        .waitFor({ state: 'visible', timeout: this.actionTimeoutMs() })
        .then(() => 'validation_error' as const),
      this.locators.splitAgentModal
        .waitFor({ state: 'hidden', timeout: this.actionTimeoutMs() })
        .then(() => 'modal_closed' as const),
    ]);
  }

  async getDropdownTriggerText(fieldId: string): Promise<string> {
    const value = (
      (await this.page
        .getByTestId(`agp-form-field-dropdown-${fieldId}-trigger`)
        .inputValue()) ?? ''
    ).trim();

    const countryFieldId = this.testData.agentAddressFields.country.fieldId;
    if (fieldId === countryFieldId) {
      const countryOption = this.testData.validAddressSamples.country;
      if (countryOption && new RegExp(countryOption, 'i').test(value)) {
        return countryOption;
      }
    }

    return value;
  }

  async attemptAddFourthSplitAgent(): Promise<{
    addButtonVisible: boolean;
    addButtonClicked: boolean;
    modalOpened: boolean;
    rowCountAfterAttempt: number;
  }> {
    const countBeforeAttempt = await this.getSplitAgentRowCount();
    const addButtonVisible = await this.isSplitAgentAddVisible();
    let addButtonClicked = false;
    let modalOpened = false;

    if (addButtonVisible) {
      addButtonClicked = await this.attemptClickSplitAgentAdd();
      modalOpened = await this.isSplitAgentModalOpen();
      if (modalOpened) {
        await this.cancelSplitAgentModal();
      }
    }

    await this.waitForSplitAgentRowCount(countBeforeAttempt);

    return {
      addButtonVisible,
      addButtonClicked,
      modalOpened,
      rowCountAfterAttempt: await this.getSplitAgentRowCount(),
    };
  }

  async isTotalPercentErrorVisible(): Promise<boolean> {
    return this.page
      .getByText(this.testData.validationMessages.totalPercentMustEqual100, {
        exact: false,
      })
      .first()
      .isVisible()
      .catch(() => false);
  }

  async isRequiredFieldErrorVisible(): Promise<boolean> {
    return this.page
      .getByText(this.testData.validationMessages.requiredField, {
        exact: false,
      })
      .first()
      .isVisible()
      .catch(() => false);
  }

  /**
   * Resets Licensing to a valid, interactable state after invalid split-percent tests.
   */
  async restoreFormForValidSubmission(
    includeLicenseNumber: boolean,
    includeAgentAddress: boolean,
    stateName?: string,
  ): Promise<void> {
    await this.ensureLicensingModuleActive();
    await this.dismissSplitAgentModalIfOpen();

    if (
      await this.locators.splitAgentCardListRoot.isVisible().catch(() => false)
    ) {
      await this.deleteAllSplitAgents();
      await this.waitForSplitAgentRowCount(0);
    }
    await this.dismissSplitAgentModalIfOpen();
    await this.selectAdditionalAgents('no');
    await this.requireMainAgentPercent('100');
    await this.ensureLicensingModuleActive();

    const officeInput = this.locators.fieldInput(
      this.testData.fields.officeId.type,
      this.testData.fields.officeId.fieldId,
    );
    await officeInput.waitFor({
      state: 'visible',
      timeout: getEnvironmentConfig().actionTimeout,
    });
    await officeInput.scrollIntoViewIfNeeded();

    await this.fillCompleteValidLicensing(
      includeLicenseNumber,
      includeAgentAddress,
      stateName,
    );
    await this.selectAdditionalAgents('no');
    await this.requireMainAgentPercent('100');
  }

  async addSplitAgent(
    data: SplitAgentData,
    includeSplitLicense = false,
  ): Promise<void> {
    const expectedRowCount = (await this.getSplitAgentRowCount()) + 1;
    await this.openSplitAgentModal();
    await this.fillSplitAgentModal(data, includeSplitLicense);
    await this.saveSplitAgentModal(expectedRowCount);
  }

  async editSplitAgent(
    index: number,
    updates: Partial<SplitAgentData>,
    includeSplitLicense = false,
  ): Promise<void> {
    await this.actions.click(
      this.locators.splitAgentEditButton(index),
      `Split Agent edit row ${index}`,
    );
    await this.locators.splitAgentModal.waitFor({
      state: 'visible',
      timeout: this.actionTimeoutMs(),
    });

    if (updates.firstName) {
      await this.locators
        .splitAgentModalField(this.testData.splitAgentFields.firstName.suffix)
        .fill(updates.firstName);
    }
    if (updates.lastName) {
      await this.locators
        .splitAgentModalField(this.testData.splitAgentFields.lastName.suffix)
        .fill(updates.lastName);
    }
    if (updates.agentNumber) {
      await this.locators
        .splitAgentModalField(this.testData.splitAgentFields.agentNumber.suffix)
        .fill(updates.agentNumber);
    }
    if (includeSplitLicense && updates.licenseNumber) {
      await this.actions.fill(
        this.locators.splitAgentModalField(
          this.testData.splitAgentFields.licenseNumber.suffix,
        ),
        updates.licenseNumber,
        this.testData.splitAgentFields.licenseNumber.label,
      );
    }
    if (updates.percent) {
      await this.locators
        .splitAgentModalField(this.testData.splitAgentFields.percent.suffix)
        .fill(updates.percent);
    }

    const rowCount = await this.getSplitAgentRowCount();
    await this.saveSplitAgentModal(rowCount);
  }

  async deleteSplitAgent(index: number): Promise<void> {
    const beforeCount = await this.getSplitAgentRowCount();
    await this.actions.click(
      this.locators.splitAgentRemoveButton(index),
      `Split Agent delete row ${index}`,
    );
    await this.actions.click(
      this.locators.splitAgentDeleteConfirmButton,
      'Split Agent delete confirm button',
    );
    await this.waitForSplitAgentRowCount(beforeCount - 1);
  }

  async deleteAllSplitAgents(): Promise<void> {
    while ((await this.locators.splitAgentRowEditButtons().count()) > 0) {
      await this.deleteSplitAgent(0);
    }
  }

  async getMainAgentPercent(): Promise<string> {
    return this.mainAgentPercentInput().inputValue();
  }

  async getSplitAgentRowCount(): Promise<number> {
    return this.locators.splitAgentRowEditButtons().count();
  }

  async isSplitAgentAddVisible(): Promise<boolean> {
    return this.locators.splitAgentAddButton.isVisible();
  }

  getFieldValue(field: LicensingFieldDefinition): Promise<string> {
    return this.locators.fieldInput(field.type, field.fieldId).inputValue();
  }
}
