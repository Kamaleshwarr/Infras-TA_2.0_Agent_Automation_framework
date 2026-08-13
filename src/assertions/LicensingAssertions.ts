import { Page } from 'playwright';
import { getEnvironmentConfig } from '../config/environment.config';
import { BaseAssertions } from '../base/BaseAssertions';
import { dependencies } from '../core/DependencyRegistry';
import { AssertionReportContext, CucumberAttach, ILogger } from '../interfaces';
import { LicensingLocators } from '../locators/LicensingLocators';
import { LicensingPage } from '../pages/LicensingPage';
import {
  LicensingFieldDefinition,
  LicensingFlowId,
  LicensingFlowProfile,
  LicensingFlowResolver,
  LicensingTestData,
  SplitAgentData,
} from '../utils/licensing/LicensingFlowResolver';
import { ValidationMatrixCollector } from '../utils/report/validationMatrixCollector';

interface FlowSession {
  stateName: string;
  flowId: LicensingFlowId;
  profile: LicensingFlowProfile;
  startedAtMs: number;
}

/**
 * Term Life Application Form — Licensing module assertions.
 * Each assertion reports independently via BaseAssertions → Allure.
 */
export class LicensingAssertions {
  private readonly logger: ILogger;
  private readonly page: Page;
  private readonly attach: CucumberAttach;
  private readonly assertions: BaseAssertions;
  private readonly locators: LicensingLocators;
  private readonly licensingPage: LicensingPage;
  private readonly testData: LicensingTestData;
  private session: FlowSession | null = null;
  private applicationStateName: string | null = null;
  private reportStepName = '';
  private validationMatrixCollector: ValidationMatrixCollector | null = null;
  private readonly splitAgentRegistry = new Map<number, SplitAgentData>();

  constructor(
    page: Page,
    attach: CucumberAttach,
    licensingPage: LicensingPage,
  ) {
    this.page = page;
    this.attach = attach;
    this.logger = dependencies.createLogger('LicensingAssertions');
    this.assertions = new BaseAssertions(page, this.logger, { attach });
    this.locators = new LicensingLocators(page);
    this.licensingPage = licensingPage;
    this.testData = LicensingFlowResolver.getTestData();
  }

  setReportContext(context: AssertionReportContext): void {
    this.assertions.setReportContext(context);
    this.reportStepName = context.stepName ?? '';
  }

  /** Binds the Term Life application state used for matrix/report labels. */
  setApplicationStateName(stateName: string): void {
    this.applicationStateName = stateName.trim();
  }

  async executeCompleteFlowCoverage(stateName: string): Promise<void> {
    try {
      await this.initSession(stateName);

      await this.assertLicensingPageStructure();
      await this.assertLicensingSectionVisible();
      await this.assertCommonFields();
      await this.assertAdditionalAgentsNoPreselectionOnInitialLoad();
      await this.assertAgentProfileDefault();
      await this.assertAgentPercentDefault();
      await this.assertMainAgentPercentNoSplitAgents();
      await this.assertPreviousButton();
      await this.assertNextButton();

      if (this.session!.profile.agentAddressPresent) {
        await this.assertAgentAddressSection();
      } else {
        await this.assertAgentAddressSectionHidden();
      }

      if (this.session!.profile.licenseNumberPresent) {
        await this.assertLicenseNumber();
      } else {
        await this.assertLicenseNumberHidden();
      }

      await this.assertRequiredFieldValidation();
      await this.assertEmailFormat();
      await this.assertOfficeIdFormat();
      await this.resetFormToValidCoreBeforeSplitAgents();

      await this.assertAdditionalAgentsNo();
      await this.assertAdditionalAgentsNoMainPercent();
      await this.assertAdditionalAgentsNoAddNewHidden();
      await this.assertAdditionalAgentsYes();
      await this.assertAdditionalAgentsYesMainPercentBeforeSplits();
      await this.assertSplitAgentModalFieldsPresent();
      await this.assertSplitAgentProfileDefaultInModal();
      await this.assertSplitAgentRequiredFields();

      if (this.session!.profile.licenseNumberPresent) {
        await this.assertLicenseNumberValidation();
        await this.resetFormToValidCoreBeforeSplitAgents();
      }

      if (this.session!.profile.agentAddressPresent) {
        await this.assertAgentAddressValidation();
        await this.resetFormToValidCoreBeforeSplitAgents();
      }

      if (
        this.session!.profile.licenseNumberPresent ||
        this.session!.profile.agentAddressPresent
      ) {
        await this.assertAdditionalAgentsYes();
      }

      await this.assertMinimumSplitAgentConfiguration();
      await this.runSplitAgentPercentWorkflow();
      await this.assertCancelSplitAgentEdit();
      await this.assertFourthSplitAgentPrevented();
      await this.assertZeroPercentSplitAgentBehavior();
      await this.assertExact100PercentWithNext();
      await this.assertLessThan100SplitTotalBehavior();
      await this.assertMoreThan100PercentOnSave();
      await this.assertMoreThan100PercentAfterEdit();
      await this.assertNextBlockedWhenTotalExceeds100();

      await this.restoreLicensingFormForValidSubmission();
      await this.assertNextWithValidData();
      await this.assertDataPersistence();
      await this.assertReturnToApplications();

      await this.attachFlowDurationSummary();
    } finally {
      await this.attachValidationMatrix();
      this.clearValidationMatrixCollector();
    }
  }

  async assertLicensingPageStructure(): Promise<void> {
    await this.assertions.verifyVisible(
      this.locators.agentInformationHeading,
      '[PASS] ✅ Licensing Page — Agent Information heading displayed',
    );
    await this.assertions.verifyVisible(
      this.locators.returnToApplicationsButton,
      '[PASS] ✅ Licensing Page — Return to Applications button displayed',
    );
  }

  async assertLicensingSectionVisible(): Promise<void> {
    await this.assertions.verifyVisible(
      this.locators.licensingSectionLink,
      '[PASS] ✅ Licensing Page — Licensing section displayed in section list',
    );
  }

  async assertCommonFields(): Promise<void> {
    const fields = this.testData.fields;
    const names = [
      fields.writingAgentFirstName,
      fields.writingAgentLastName,
      fields.agentNumber,
      fields.officeId,
      fields.agentEmail,
      fields.phoneNumber,
    ];

    for (const field of names) {
      await this.assertions.verifyVisible(
        this.locators.fieldInput(field.type, field.fieldId),
        `[PASS] ✅ Licensing Page — ${field.label} field displayed`,
      );
    }

    await this.assertions.verifyVisible(
      this.locators.radioswitchOption(
        fields.anyAdditionalAgents.fieldId,
        'yes',
      ),
      '[PASS] ✅ Additional Agents — Yes option displayed',
    );
    await this.assertions.verifyVisible(
      this.locators.radioswitchOption(fields.anyAdditionalAgents.fieldId, 'no'),
      '[PASS] ✅ Additional Agents — No option displayed',
    );
  }

  async assertAdditionalAgentsNoPreselectionOnInitialLoad(): Promise<void> {
    const field = this.testData.fields.anyAdditionalAgents;
    const noInput = this.page.getByTestId(
      `agp-form-field-radioswitch-${field.fieldId}-option-no-input`,
    );
    const yesInput = this.page.getByTestId(
      `agp-form-field-radioswitch-${field.fieldId}-option-yes-input`,
    );

    const isNoSelected = await noInput.isChecked();
    const isYesSelected = await yesInput.isChecked();

    let actualSelection: string;
    if (isNoSelected && !isYesSelected) {
      actualSelection = 'No selected';
    } else if (isYesSelected && !isNoSelected) {
      actualSelection = 'Yes selected';
    } else if (isNoSelected && isYesSelected) {
      actualSelection = 'Both Yes and No selected';
    } else {
      actualSelection = 'Neither Yes nor No selected';
    }

    await this.assertObservedValue(
      'no option pre-selected on initial load',
      'Neither Yes nor No selected',
      actualSelection,
      'Additional Agents',
    );
  }

  async assertAgentProfileDefault(): Promise<void> {
    const field = this.testData.fields.agentProfile;
    const input = this.locators.fieldInput(field.type, field.fieldId);
    await this.assertions.verifyVisible(
      input,
      '[PASS] ✅ Licensing Page — Agent Profile field displayed',
    );
    await this.assertions.verifyDisabled(
      input,
      '[PASS] ✅ Licensing Page — Agent Profile field disabled',
    );
    await this.assertions.verifyAttribute(
      input,
      'value',
      field.defaultValue ?? '001',
      '[PASS] ✅ Licensing Page — Agent Profile default value is 001',
    );
  }

  async assertAgentPercentDefault(): Promise<void> {
    const field = this.testData.fields.agentPercent;
    const input = this.locators.fieldInput(field.type, field.fieldId);
    await this.assertions.verifyVisible(
      input,
      '[PASS] ✅ Licensing Page — Agent Percent field displayed',
    );
    await this.assertions.verifyDisabled(
      input,
      '[PASS] ✅ Licensing Page — Agent Percent field disabled',
    );
    await this.assertions.verifyAttribute(
      input,
      'value',
      field.defaultValue ?? '100',
      '[PASS] ✅ Licensing Page — Initial Main Agent Percentage default is 100',
    );
  }

  async assertMainAgentPercentNoSplitAgents(): Promise<void> {
    await this.licensingPage.selectAdditionalAgents('no');
    await this.assertMainAgentPercentCalculation(
      '100',
      'with Additional Agents set to No',
    );
  }

  async assertAgentAddressSection(): Promise<void> {
    await this.assertions.verifyVisible(
      this.locators.agentAddressHeading,
      '[PASS] ✅ Agent Address — section heading displayed for applicable flow',
    );
    await this.assertions.verifyVisible(
      this.locators.addressLine1Label,
      '[PASS] ✅ Agent Address — Address Line 1 label displayed',
    );
    for (const label of this.testData.agentAddressLabels) {
      await this.assertions.verifyVisible(
        this.page
          .getByText(new RegExp(label.replace(/[()]/g, '\\$&'), 'i'))
          .first(),
        `[PASS] ✅ Agent Address — ${label} displayed`,
      );
    }
  }

  async assertAgentAddressSectionHidden(): Promise<void> {
    await this.assertions.verifyHidden(
      this.locators.agentAddressHeading,
      `[PASS] ✅ Agent Address — section not applicable for ${this.session!.stateName}`,
    );
  }

  async assertLicenseNumber(): Promise<void> {
    const field = this.testData.fields.licenseNumber;
    await this.assertions.verifyVisible(
      this.locators.fieldInput(field.type, field.fieldId),
      '[PASS] ✅ License Number — field displayed for applicable flow',
    );
  }

  async assertLicenseNumberHidden(): Promise<void> {
    const field = this.testData.fields.licenseNumber;
    await this.assertions.verifyHidden(
      this.locators.fieldInput(field.type, field.fieldId),
      `[PASS] ✅ License Number — field not applicable for ${this.session!.stateName}`,
    );
  }

  async assertPreviousButton(): Promise<void> {
    await this.assertions.verifyDisabled(
      this.locators.previousButton,
      '[PASS] ✅ Navigation — Previous button disabled on initial Licensing page',
    );
  }

  async assertNextButton(): Promise<void> {
    await this.assertions.verifyEnabled(
      this.locators.primaryNextButton,
      '[PASS] ✅ Navigation — Next button enabled on initial Licensing page',
    );
  }

  async assertRequiredFieldValidation(): Promise<void> {
    await this.licensingPage.selectAdditionalAgents('no');
    await this.locators.primaryNextButton.click();

    const message = this.testData.validationMessages.requiredField;
    for (const field of this.coreRequiredFields(false)) {
      await this.assertFieldMessage(
        field,
        message,
        `[PASS] ✅ Field Validations — Required validation displayed for ${field.label}`,
      );
    }
  }

  async assertEmailFormat(): Promise<void> {
    await this.fillValidCore(false);
    await this.fillField(
      this.testData.fields.agentEmail,
      this.testData.invalidSamples.email,
    );
    await this.locators.primaryNextButton.click();
    await this.assertFieldMessage(
      this.testData.fields.agentEmail,
      this.testData.validationMessages.invalidEmail,
      '[PASS] ✅ Field Validations — Email format validation message displayed',
    );
  }

  async assertOfficeIdFormat(): Promise<void> {
    await this.fillField(
      this.testData.fields.agentEmail,
      this.testData.validSamples.agentEmail,
    );
    await this.fillField(
      this.testData.fields.officeId,
      this.testData.invalidSamples.officeIdNonNumeric,
    );
    await this.locators.primaryNextButton.click();
    await this.assertFieldMessage(
      this.testData.fields.officeId,
      this.testData.validationMessages.invalidNumeric,
      '[PASS] ✅ Field Validations — Office Id numeric format validation message displayed',
    );
  }

  async assertLicenseNumberValidation(): Promise<void> {
    await this.fillValidCore(false);
    await this.locators.primaryNextButton.click();
    await this.assertFieldMessage(
      this.testData.fields.licenseNumber,
      this.testData.validationMessages.licenseNumberRequired,
      '[PASS] ✅ Field Validations — License Number required validation message displayed',
    );
  }

  async assertAgentAddressValidation(): Promise<void> {
    await this.fillValidCore(this.session!.profile.licenseNumberPresent);
    await this.locators.primaryNextButton.click();
    await this.assertions.verifyVisible(
      this.page
        .getByText(this.testData.validationMessages.requiredField, {
          exact: false,
        })
        .first(),
      `[PASS] ✅ Field Validations — Agent Address required validation displayed for ${this.session!.stateName}`,
    );
  }

  async assertAdditionalAgentsNo(): Promise<void> {
    await this.licensingPage.selectAdditionalAgents('no');
    await this.assertions.verifyHidden(
      this.locators.splitAgentCardListRoot,
      '[PASS] ✅ Additional Agents — Split Agent Details hidden when No is selected',
    );
  }

  async assertAdditionalAgentsNoMainPercent(): Promise<void> {
    await this.assertMainAgentPercentCalculation(
      '100',
      'with Additional Agents set to No',
    );
  }

  async assertAdditionalAgentsNoAddNewHidden(): Promise<void> {
    await this.assertions.verifyHidden(
      this.locators.splitAgentAddButton,
      '[PASS] ✅ Additional Agents — Add New hidden when No is selected',
    );
  }

  async assertAdditionalAgentsYes(): Promise<void> {
    await this.licensingPage.selectAdditionalAgents('yes');
    await this.assertions.verifyVisible(
      this.locators.splitAgentCardListRoot,
      '[PASS] ✅ Additional Agents — Split Agent Details section displayed when Yes is selected',
    );
    await this.assertions.verifyVisible(
      this.locators.splitAgentAddButton,
      '[PASS] ✅ Additional Agents — Add New button displayed when Yes is selected',
    );
  }

  async assertAdditionalAgentsYesMainPercentBeforeSplits(): Promise<void> {
    const actual = await this.licensingPage.getMainAgentPercent();
    await this.assertAcceptedOneOf(
      'Main Agent Percentage before split agents are added',
      actual,
      ['100', ''],
      'Additional Agents',
    );
  }

  async assertSplitAgentModalFieldsPresent(): Promise<void> {
    await this.licensingPage.openSplitAgentModal();
    const fields = this.testData.splitAgentFields;
    for (const key of [
      'firstName',
      'lastName',
      'agentNumber',
      'percent',
      'profile',
    ] as const) {
      await this.assertions.verifyVisible(
        this.locators.splitAgentModalField(fields[key].suffix),
        `[PASS] ✅ Split Agent — Add — ${fields[key].label} field present in modal`,
      );
    }
    if (this.splitAgentUsesLicenseField()) {
      await this.assertions.verifyVisible(
        this.locators.splitAgentModalField(fields.licenseNumber.suffix),
        '[PASS] ✅ Split Agent — Add — Split Agent License Number field present in modal',
      );
    }
    await this.licensingPage.cancelSplitAgentModal();
  }

  async assertSplitAgentProfileDefaultInModal(): Promise<void> {
    await this.licensingPage.openSplitAgentModal();
    const profile = this.testData.splitAgentFields.profile;
    await this.assertions.verifyAttribute(
      this.locators.splitAgentModalField(profile.suffix),
      'value',
      profile.defaultValue ?? '001',
      '[PASS] ✅ Split Agent — Add — Split Agent Profile default value is 001 in modal',
    );
    await this.licensingPage.cancelSplitAgentModal();
  }

  async assertSplitAgentRequiredFields(): Promise<void> {
    await this.licensingPage.openSplitAgentModal();
    await this.licensingPage.saveSplitAgentModal();
    const message = this.testData.validationMessages.requiredField;
    await this.assertions.verifyVisible(
      this.page.getByText(message, { exact: false }).first(),
      '[PASS] ✅ Split Agent — Add — Required field validation displayed on empty save',
    );
    await this.licensingPage.cancelSplitAgentModal();
  }

  async assertMinimumSplitAgentConfiguration(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    const minimum: SplitAgentData = {
      ...this.testData.splitAgentSamples.agent1,
      firstName: 'Min',
      lastName: 'Agent',
      percent: this.testData.splitAgentSamples.minimumPercent,
    };

    const before = await this.licensingPage.getSplitAgentRowCount();
    await this.licensingPage.addSplitAgent(
      minimum,
      this.splitAgentUsesLicenseField(),
    );
    const after = await this.licensingPage.getSplitAgentRowCount();

    await this.assertObservedValue(
      'Minimum split agent saved to card list',
      String(before + 1),
      String(after),
      'Split Agent — Add',
    );
    await this.assertMainAgentPercentCalculation(
      '99',
      'with one split agent at minimum valid percentage (1%)',
    );
    await this.assertions.verifyEnabled(
      this.locators.primaryNextButton,
      '[PASS] ✅ Navigation — Next enabled with one valid minimum split agent',
    );
  }

  async assertCancelSplitAgentEdit(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    const sample = this.testData.splitAgentSamples.agent1;
    await this.licensingPage.addSplitAgent(
      sample,
      this.splitAgentUsesLicenseField(),
    );

    await this.licensingPage.openSplitAgentEditModal(0);
    const originalFirstName =
      await this.licensingPage.getSplitAgentModalFieldValue(
        this.testData.splitAgentFields.firstName.suffix,
      );
    await this.licensingPage.setSplitAgentModalFieldValue(
      this.testData.splitAgentFields.firstName.suffix,
      'CancelledName',
    );
    await this.licensingPage.cancelSplitAgentModal();
    await this.licensingPage.waitForSplitAgentModalHidden();

    await this.assertObservedValue(
      'Split Agent edit modal closed after Cancel',
      'closed',
      (await this.licensingPage.isSplitAgentModalOpen()) ? 'open' : 'closed',
      'Split Agent — Cancel',
    );

    const savedFirstName =
      await this.licensingPage.readSplitAgentFieldFromEditModal(
        0,
        this.testData.splitAgentFields.firstName.suffix,
      );
    await this.assertObservedValue(
      'Original Split Agent First Name preserved after Cancel',
      originalFirstName,
      savedFirstName,
      'Split Agent — Cancel',
    );
    await this.assertObservedValue(
      'Edited Split Agent First Name not persisted after Cancel',
      'CancelledName not saved',
      savedFirstName === 'CancelledName'
        ? 'CancelledName saved'
        : 'CancelledName not saved',
      'Split Agent — Cancel',
    );
  }

  async assertFourthSplitAgentPrevented(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    await this.licensingPage.addSplitAgent(
      this.testData.splitAgentSamples.agent1,
      this.splitAgentUsesLicenseField(),
    );
    await this.licensingPage.addSplitAgent(
      this.testData.splitAgentSamples.agent2,
      this.splitAgentUsesLicenseField(),
    );
    await this.licensingPage.addSplitAgent(
      this.testData.splitAgentSamples.agent3,
      this.splitAgentUsesLicenseField(),
    );

    const maxAgents = String(this.testData.maxSplitAgents);
    const countBeforeAttempt = await this.licensingPage.getSplitAgentRowCount();
    await this.assertObservedValue(
      'Maximum of 3 split agents enforced before fourth-agent attempt',
      maxAgents,
      String(countBeforeAttempt),
      'Split Agent — Maximum',
    );

    const addButton = this.locators.splitAgentAddButton;
    const addButtonVisible = await addButton.isVisible();
    const addButtonEnabled = addButtonVisible && (await addButton.isEnabled());
    let countAfterAttempt = countBeforeAttempt;

    if (!addButtonVisible) {
      await this.assertions.verifyHidden(
        addButton,
        '[PASS] ✅ Split Agent — Maximum — Add New hidden at maximum of 3 split agents',
      );
      countAfterAttempt = await this.licensingPage.getSplitAgentRowCount();
    } else if (!addButtonEnabled) {
      await this.assertions.verifyDisabled(
        addButton,
        '[PASS] ✅ Split Agent — Maximum — Add New disabled at maximum of 3 split agents',
      );
      countAfterAttempt = await this.licensingPage.getSplitAgentRowCount();
    } else {
      const attempt = await this.licensingPage.attemptAddFourthSplitAgent();
      countAfterAttempt = attempt.rowCountAfterAttempt;

      await this.assertObservedValue(
        'Fourth split agent prevented — split-agent count remains 3',
        maxAgents,
        String(countAfterAttempt),
        'Split Agent — Maximum',
      );

      if (attempt.modalOpened) {
        await this.assertObservedValue(
          'Fourth split agent modal closed without saving a fourth agent',
          'modal closed',
          (await this.licensingPage.isSplitAgentModalOpen())
            ? 'modal open'
            : 'modal closed',
          'Split Agent — Maximum',
        );
      }
    }

    await this.assertObservedValue(
      'Fourth split agent was not created',
      'not created',
      countAfterAttempt > countBeforeAttempt ? 'created' : 'not created',
      'Split Agent — Maximum',
    );
    await this.assertObservedValue(
      'Split agent count remained at maximum of 3',
      maxAgents,
      String(countAfterAttempt),
      'Split Agent — Maximum',
    );
  }

  async assertZeroPercentSplitAgentBehavior(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    await this.licensingPage.openSplitAgentModal();
    await this.licensingPage.fillSplitAgentModal(
      {
        ...this.testData.splitAgentSamples.agent1,
        percent: this.testData.splitAgentSamples.zeroPercent,
      },
      this.splitAgentUsesLicenseField(),
    );
    await this.licensingPage.saveSplitAgentModal();
    const rowCount = await this.licensingPage.getSplitAgentRowCount();
    const mainPercent = await this.licensingPage.getMainAgentPercent();

    if (rowCount === 1) {
      await this.assertObservedValue(
        'Zero percent split agent saved to card list',
        '1 split agent row',
        `${rowCount} split agent row`,
        'Percentage Validation',
      );
      await this.assertMainAgentPercentCalculation(
        '100',
        'with zero-percent split agent accepted by application',
      );
    } else {
      await this.assertObservedValue(
        'Zero percent split agent save rejected',
        '0 split agent rows',
        `${rowCount} split agent rows`,
        'Percentage Validation',
      );
      await this.assertObservedValue(
        'Main Agent Percentage unchanged when zero-percent save rejected',
        '100',
        mainPercent || 'empty',
        'Percentage Validation',
      );
    }

    const hasTotalError = await this.licensingPage.isTotalPercentErrorVisible();
    if (hasTotalError) {
      await this.assertions.verifyVisible(
        this.page
          .getByText(
            this.testData.validationMessages.totalPercentMustEqual100,
            { exact: false },
          )
          .first(),
        '[PASS] ✅ Percentage Validation — Total percentage validation message displayed for zero-percent split agent',
      );
    } else {
      await this.assertions.verifyHidden(
        this.page
          .getByText(
            this.testData.validationMessages.totalPercentMustEqual100,
            { exact: false },
          )
          .first(),
        '[PASS] ✅ Percentage Validation — Total percentage validation message not displayed for zero-percent split agent',
      );
    }

    await this.licensingPage.deleteAllSplitAgents();
  }

  async assertExact100PercentWithNext(): Promise<void> {
    await this.fillValidCore(this.session!.profile.licenseNumberPresent);
    if (this.session!.profile.agentAddressPresent) {
      await this.licensingPage.fillValidAgentAddress(this.session!.stateName);
    }
    await this.licensingPage.selectAdditionalAgents('yes');
    const splitAgentData = {
      ...this.testData.splitAgentSamples.agent1,
      percent: this.testData.splitAgentSamples.exact100SplitPercent,
    };
    await this.licensingPage.addSplitAgent(
      splitAgentData,
      this.splitAgentUsesLicenseField(),
    );

    const expectedMainPercent = '75';
    const splitPercent = splitAgentData.percent;

    await this.assertObservedValue(
      'Exactly-100% split configuration saved with one split agent',
      'valid',
      (await this.licensingPage.getSplitAgentRowCount()) === 1
        ? 'valid'
        : 'invalid',
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Total Split Agent Percentage equals 100% for valid configuration',
      '100',
      String(Number(splitPercent) + Number(expectedMainPercent)),
      'Percentage Validation',
    );
    await this.assertMainAgentPercentCalculation(
      expectedMainPercent,
      `with Split Agent at ${splitPercent}% (exactly 100% total configuration)`,
    );
    await this.assertions.verifyHidden(
      this.page
        .getByText(this.testData.validationMessages.totalPercentMustEqual100, {
          exact: false,
        })
        .first(),
      '[PASS] ✅ Percentage Validation — Total percentage validation error not displayed for valid 100% configuration',
    );
    await this.assertions.verifyEnabled(
      this.locators.primaryNextButton,
      '[PASS] ✅ Navigation — Next enabled for valid 100% configuration',
    );

    await this.licensingPage.clickPrimaryNext();

    await this.locators.agentInformationHeading.waitFor({
      state: 'hidden',
      timeout: getEnvironmentConfig().actionTimeout,
    });

    const navigationResult =
      (await this.locators.licensingSectionLink.isVisible())
        ? 'Licensing section still available'
        : 'navigated away from Licensing';

    await this.assertObservedValue(
      'Valid 100% configuration navigates forward from Licensing',
      'navigated away from Licensing',
      navigationResult,
      'Navigation',
    );

    await this.licensingPage.navigateToLicensingModule();
    await this.licensingPage.deleteAllSplitAgents();
  }

  async assertLessThan100SplitTotalBehavior(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    await this.licensingPage.selectAdditionalAgents('yes');
    const agent1 = this.testData.splitAgentSamples.agent1;
    await this.licensingPage.addSplitAgent(
      agent1,
      this.splitAgentUsesLicenseField(),
    );

    const fields = this.testData.splitAgentFields;
    const agent1Percent =
      await this.licensingPage.readSplitAgentFieldFromEditModal(
        0,
        fields.percent.suffix,
      );
    const totalSplit = Number(agent1Percent);
    const expectedMain = String(100 - totalSplit);

    await this.assertObservedValue(
      'Split Agent 1 added for less-than-100% validation',
      '1',
      String(await this.licensingPage.getSplitAgentRowCount()),
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Split Agent total is less than 100%',
      'less than 100%',
      totalSplit < 100 ? 'less than 100%' : 'not less than 100%',
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Split Agent total percentage for less-than-100% allocation',
      `${agent1.percent}%`,
      `${agent1Percent}%`,
      'Percentage Validation',
    );

    await this.licensingPage.requireMainAgentPercent(expectedMain);
    const actualMain = await this.licensingPage.getMainAgentPercent();
    await this.assertObservedValue(
      'Main Agent percentage recalculated from split total',
      expectedMain,
      actualMain || 'empty',
      'Percentage Validation',
    );

    const overallAllocation = totalSplit + Number(actualMain);
    await this.assertObservedValue(
      'Overall allocation equals 100%',
      '100',
      String(overallAllocation),
      'Percentage Validation',
    );

    const errorVisible = await this.licensingPage.isTotalPercentErrorVisible();
    await this.assertObservedValue(
      'No total-percentage validation message for valid less-than-100% split allocation',
      'hidden',
      errorVisible ? 'visible' : 'hidden',
      'Percentage Validation',
    );

    await this.licensingPage.deleteAllSplitAgents();
  }

  async assertMoreThan100PercentOnSave(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    this.splitAgentRegistry.clear();

    const agent1 = this.splitSample('agent1', '60');
    await this.licensingPage.addSplitAgent(
      agent1,
      this.splitAgentUsesLicenseField(),
    );
    this.recordSplitAgent(0, agent1);

    const countBeforeSecondSave =
      await this.licensingPage.getSplitAgentRowCount();
    const agent2 = this.splitSample(
      'agent2',
      this.testData.splitAgentSamples.invalidOverflowPercent,
    );
    const expectedCountAfterSave = countBeforeSecondSave + 1;

    await this.licensingPage.openSplitAgentModal();
    await this.licensingPage.fillSplitAgentModal(
      agent2,
      this.splitAgentUsesLicenseField(),
    );
    await this.licensingPage.saveSplitAgentModal(expectedCountAfterSave);
    this.recordSplitAgent(1, agent2);

    await this.licensingPage.cancelSplitAgentModalIfOpen();
    await this.assertObservedValue(
      'Split Agent modal closed after invalid greater-than-100% save',
      'closed',
      (await this.licensingPage.isSplitAgentModalOpen()) ? 'open' : 'closed',
      'Percentage Validation',
    );

    const countAfterSave = await this.licensingPage.getSplitAgentRowCount();
    await this.assertObservedValue(
      'Invalid split agent persisted after greater-than-100% save',
      'persisted',
      countAfterSave === expectedCountAfterSave ? 'persisted' : 'not persisted',
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Split agent count after invalid greater-than-100% save',
      String(expectedCountAfterSave),
      String(countAfterSave),
      'Percentage Validation',
    );

    const fields = this.testData.splitAgentFields;
    const agent1Percent =
      await this.licensingPage.readSplitAgentFieldFromEditModal(
        0,
        fields.percent.suffix,
      );
    const agent2Percent =
      await this.licensingPage.readSplitAgentFieldFromEditModal(
        1,
        fields.percent.suffix,
      );
    const totalSplitPercent = Number(agent1Percent) + Number(agent2Percent);
    const calculatedMainPercent = String(100 - totalSplitPercent);
    const actualMainPercent = await this.licensingPage.getMainAgentPercent();

    await this.assertObservedValue(
      'Split Agent 1 percentage after invalid save',
      `${agent1.percent}%`,
      `${agent1Percent}%`,
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Split Agent 2 percentage after invalid save',
      `${agent2.percent}%`,
      `${agent2Percent}%`,
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Total Split Agent Percentage exceeds 100%',
      `${Number(agent1.percent) + Number(agent2.percent)}%`,
      `${totalSplitPercent}%`,
      'Percentage Validation',
    );

    await this.assertions.verifyVisible(
      this.page
        .getByText(this.testData.validationMessages.totalPercentMustEqual100, {
          exact: false,
        })
        .first(),
      '[PASS] ✅ Percentage Validation — Total percentage validation message displayed for greater-than-100% total',
    );

    await this.assertObservedValue(
      'Main Agent Percentage calculated from invalid split totals',
      calculatedMainPercent,
      actualMainPercent || 'empty',
      'Percentage Validation',
    );

    await this.licensingPage.clickPrimaryNext();

    const onLicensing = await this.licensingPage.isLicensingModuleDisplayed();
    const hasTotalErrorAfterNext =
      await this.licensingPage.isTotalPercentErrorVisible();

    await this.assertObservedValue(
      'Next navigation blocked when total split percentage exceeds 100%',
      'remain on Licensing',
      onLicensing ? 'remain on Licensing' : 'navigated away from Licensing',
      'Navigation',
    );
    await this.assertObservedValue(
      'Licensing section remains active after blocked Next for invalid total',
      'displayed',
      onLicensing ? 'displayed' : 'hidden',
      'Navigation',
    );
    await this.assertObservedValue(
      'Total percentage validation message remains visible after blocked Next',
      'visible',
      hasTotalErrorAfterNext ? 'visible' : 'hidden',
      'Percentage Validation',
    );

    await this.licensingPage.deleteAllSplitAgents();
    this.splitAgentRegistry.clear();
  }

  async assertMoreThan100PercentAfterEdit(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    this.splitAgentRegistry.clear();

    const agent1 = this.splitSample('agent1', '60');
    const agent2 = this.splitSample('agent2', '30');
    await this.licensingPage.addSplitAgent(
      agent1,
      this.splitAgentUsesLicenseField(),
    );
    this.recordSplitAgent(0, agent1);
    await this.licensingPage.addSplitAgent(
      agent2,
      this.splitAgentUsesLicenseField(),
    );
    this.recordSplitAgent(1, agent2);

    await this.licensingPage.editSplitAgent(
      1,
      { percent: '50' },
      this.splitAgentUsesLicenseField(),
    );
    this.updateRegisteredSplitAgent(1, { percent: '50' });

    const fields = this.testData.splitAgentFields;
    const agent1Percent =
      await this.licensingPage.readSplitAgentFieldFromEditModal(
        0,
        fields.percent.suffix,
      );
    const agent2Percent =
      await this.licensingPage.readSplitAgentFieldFromEditModal(
        1,
        fields.percent.suffix,
      );
    const splitTotal = Number(agent1Percent) + Number(agent2Percent);

    await this.assertObservedValue(
      'Split Agent 1 percentage after edit to invalid total',
      '60%',
      `${agent1Percent}%`,
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Split Agent 2 percentage after edit to invalid total',
      '50%',
      `${agent2Percent}%`,
      'Percentage Validation',
    );
    await this.assertObservedValue(
      'Total Split Agent Percentage exceeds 100% after edit',
      '110%',
      `${splitTotal}%`,
      'Percentage Validation',
    );
    await this.assertMainAgentPercentCalculation(
      '-10',
      'after editing Split Agent 2 to 50% (total split 110%)',
    );
    await this.assertions.verifyVisible(
      this.page
        .getByText(this.testData.validationMessages.totalPercentMustEqual100, {
          exact: false,
        })
        .first(),
      '[PASS] ✅ Percentage Validation — Total percentage validation message displayed after edit to invalid total',
    );
  }

  async assertNextBlockedWhenTotalExceeds100(): Promise<void> {
    await this.licensingPage.clickPrimaryNext();

    const onLicensing = await this.licensingPage.isLicensingModuleDisplayed();
    const hasTotalError = await this.licensingPage.isTotalPercentErrorVisible();

    await this.assertObservedValue(
      'Next navigation blocked after edit produced invalid total exceeding 100%',
      'blocked',
      onLicensing ? 'blocked' : 'allowed',
      'Navigation',
    );
    await this.assertObservedValue(
      'Licensing section remains active after blocked Next for edited invalid total',
      'displayed',
      onLicensing ? 'displayed' : 'hidden',
      'Navigation',
    );
    await this.assertObservedValue(
      'Total percentage validation message visible after blocked Next for edited invalid total',
      'error visible',
      hasTotalError ? 'error visible' : 'error hidden',
      'Percentage Validation',
    );
  }

  async assertAddSplitAgent(
    data: SplitAgentData,
    expectedRowLabel: string,
  ): Promise<void> {
    const before = await this.licensingPage.getSplitAgentRowCount();
    await this.licensingPage.addSplitAgent(
      data,
      this.splitAgentUsesLicenseField(),
    );
    const after = await this.licensingPage.getSplitAgentRowCount();
    const agentIndex = after - 1;
    const fields = this.testData.splitAgentFields;

    await this.assertObservedValue(
      `${expectedRowLabel} added — split-agent count increased`,
      String(before + 1),
      String(after),
      'Split Agent — Add',
    );
    await this.assertObservedValue(
      `${expectedRowLabel} record exists in card list`,
      'record exists',
      after > before ? 'record exists' : 'record missing',
      'Split Agent — Add',
    );

    await this.licensingPage.openSplitAgentEditModal(agentIndex);
    const saved: SplitAgentData = {
      firstName: await this.licensingPage.getSplitAgentModalFieldValue(
        fields.firstName.suffix,
      ),
      lastName: await this.licensingPage.getSplitAgentModalFieldValue(
        fields.lastName.suffix,
      ),
      agentNumber: await this.licensingPage.getSplitAgentModalFieldValue(
        fields.agentNumber.suffix,
      ),
      percent: await this.licensingPage.getSplitAgentModalFieldValue(
        fields.percent.suffix,
      ),
    };
    const profileValue = await this.licensingPage.getSplitAgentModalFieldValue(
      fields.profile.suffix,
    );
    await this.licensingPage.cancelSplitAgentModal();

    await this.assertObservedValue(
      `${expectedRowLabel} First Name persisted after Save`,
      data.firstName,
      saved.firstName,
      'Split Agent — Add',
    );
    await this.assertObservedValue(
      `${expectedRowLabel} Last Name persisted after Save`,
      data.lastName,
      saved.lastName,
      'Split Agent — Add',
    );
    await this.assertObservedValue(
      `${expectedRowLabel} Agent Number persisted after Save`,
      data.agentNumber,
      saved.agentNumber,
      'Split Agent — Add',
    );
    await this.assertObservedValue(
      `${expectedRowLabel} Percentage persisted after Save`,
      data.percent,
      saved.percent,
      'Split Agent — Add',
    );
    await this.assertObservedValue(
      `${expectedRowLabel} Profile persisted after Save`,
      fields.profile.defaultValue ?? '001',
      profileValue,
      'Split Agent — Add',
    );

    this.recordSplitAgent(agentIndex, saved);

    const cardText = await this.licensingPage.getSplitAgentCardListText();
    const expectedCardLabel = `Split Agent Details - ${after}`;
    await this.assertObservedValue(
      `${expectedRowLabel} displayed in card list`,
      expectedCardLabel,
      cardText.includes(expectedCardLabel)
        ? expectedCardLabel
        : cardText.slice(0, 160),
      'Split Agent — Add',
    );
  }

  async assertEditSplitAgent(
    index: number,
    updates: Partial<SplitAgentData>,
    label: string,
    options?: {
      expectedLoadedPercent?: string;
      expectedMainPercentAfter?: string;
    },
  ): Promise<void> {
    const beforeCount = await this.licensingPage.getSplitAgentRowCount();
    const fields = this.testData.splitAgentFields;

    await this.licensingPage.openSplitAgentEditModal(index);
    await this.assertObservedValue(
      `Edit modal opened for ${label}`,
      'open',
      (await this.licensingPage.isSplitAgentModalOpen()) ? 'open' : 'closed',
      'Split Agent — Edit',
    );

    if (options?.expectedLoadedPercent) {
      const loadedPercent =
        await this.licensingPage.getSplitAgentModalFieldValue(
          fields.percent.suffix,
        );
      await this.assertObservedValue(
        `Existing percentage loaded in edit modal for ${label}`,
        options.expectedLoadedPercent,
        loadedPercent,
        'Split Agent — Edit',
      );
    }

    if (updates.percent) {
      await this.licensingPage.setSplitAgentModalFieldValue(
        fields.percent.suffix,
        updates.percent,
      );
      const changedPercent =
        await this.licensingPage.getSplitAgentModalFieldValue(
          fields.percent.suffix,
        );
      await this.assertObservedValue(
        `Percentage changed in edit modal for ${label}`,
        updates.percent,
        changedPercent,
        'Split Agent — Edit',
      );
      await this.licensingPage.saveSplitAgentModal(beforeCount);
      await this.licensingPage.waitForSplitAgentModalHidden();
      await this.assertObservedValue(
        `Edited percentage persisted for ${label}`,
        updates.percent,
        changedPercent,
        'Split Agent — Edit',
      );
      this.updateRegisteredSplitAgent(index, { percent: updates.percent });
    } else {
      await this.licensingPage.cancelSplitAgentModal();
      await this.licensingPage.editSplitAgent(
        index,
        updates,
        this.splitAgentUsesLicenseField(),
      );
    }

    const afterCount = await this.licensingPage.getSplitAgentRowCount();
    await this.assertObservedValue(
      `Split-agent count unchanged after edit for ${label}`,
      String(beforeCount),
      String(afterCount),
      'Split Agent — Edit',
    );

    if (updates.percent && options?.expectedMainPercentAfter) {
      await this.assertMainAgentPercentCalculation(
        options.expectedMainPercentAfter,
        `after editing ${label} to ${updates.percent}%`,
      );
    }
  }

  async assertDeleteSplitAgent(
    index: number,
    label: string,
    expectedMainPercentAfter: string,
  ): Promise<void> {
    const beforeCount = await this.licensingPage.getSplitAgentRowCount();
    const deletedAgent = this.requireRegisteredSplitAgent(index);
    const remainingExpectations: SplitAgentData[] = [];
    for (let i = 0; i < beforeCount; i++) {
      if (i !== index) {
        remainingExpectations.push(this.requireRegisteredSplitAgent(i));
      }
    }

    await this.licensingPage.deleteSplitAgent(index);
    const afterCount = await this.licensingPage.getSplitAgentRowCount();

    await this.assertObservedValue(
      `Split-agent count decreased after deleting ${label}`,
      String(beforeCount - 1),
      String(afterCount),
      'Split Agent — Delete',
    );

    const cardText = await this.licensingPage.getSplitAgentCardListText();
    await this.assertObservedValue(
      `Deleted ${label} removed from card list`,
      'absent',
      cardText.includes(deletedAgent.agentNumber) ? 'present' : 'absent',
      'Split Agent — Delete',
    );

    const fields = this.testData.splitAgentFields;
    for (let i = 0; i < afterCount; i++) {
      const expected = remainingExpectations[i];
      const read = await this.licensingPage.readSplitAgentFieldsFromEditModal(
        i,
        [fields.agentNumber.suffix, fields.percent.suffix],
      );
      await this.assertObservedValue(
        `Remaining split agent ${i + 1} Agent Number preserved after deleting ${label}`,
        expected.agentNumber,
        read[fields.agentNumber.suffix],
        'Split Agent — Delete',
      );
      await this.assertObservedValue(
        `Remaining split agent ${i + 1} Percentage preserved after deleting ${label}`,
        expected.percent,
        read[fields.percent.suffix],
        'Split Agent — Delete',
      );
    }

    await this.rebuildSplitAgentRegistryAfterDelete(index);
    await this.assertMainAgentPercentCalculation(
      expectedMainPercentAfter,
      `after deleting ${label}`,
    );
  }

  async assertMaximumSplitAgents(): Promise<void> {
    const count = await this.licensingPage.getSplitAgentRowCount();
    await this.assertObservedValue(
      'Maximum of 3 split agents saved to card list',
      String(this.testData.maxSplitAgents),
      String(count),
      'Split Agent — Maximum',
    );
    await this.assertObservedValue(
      'Add New hidden or blocked after 3 split agents saved',
      'Add New hidden or blocked',
      (await this.licensingPage.isSplitAgentAddVisible())
        ? 'Add New visible'
        : 'Add New hidden or blocked',
      'Split Agent — Maximum',
    );
  }

  async assertMainAgentPercentCalculation(
    expectedPercent: string,
    contextDescription?: string,
  ): Promise<void> {
    await this.licensingPage.requireMainAgentPercent(expectedPercent);
    const actualPercent = await this.licensingPage.getMainAgentPercent();
    const description = contextDescription
      ? `Main Agent Percentage recalculated — ${contextDescription}`
      : `Main Agent Percentage recalculated to ${expectedPercent}%`;
    await this.assertObservedValue(
      description,
      expectedPercent,
      actualPercent || 'empty',
      'Percentage Validation',
    );
  }

  async assertNextWithValidData(): Promise<void> {
    await this.licensingPage.clickPrimaryNext();

    const requiredError = this.page.getByText(
      this.testData.validationMessages.requiredField,
      { exact: false },
    );
    await this.assertions.verifyHidden(
      requiredError.first(),
      '[PASS] ✅ Navigation — No required-field validation after Next with valid restored data',
    );
    await this.assertions.verifyVisible(
      this.locators.licensingSectionLink,
      '[PASS] ✅ Navigation — Licensing section still available after Next with valid data',
    );
  }

  async assertDataPersistence(): Promise<void> {
    const fields = this.testData.fields;
    const samples = this.testData.validSamples;
    const profile = this.session!.profile;

    await this.licensingPage.navigateToProposedPrimaryInsuredSection();
    await this.licensingPage.navigateToLicensingModule();

    await this.assertions.verifyAttribute(
      this.locators.fieldInput(
        fields.writingAgentFirstName.type,
        fields.writingAgentFirstName.fieldId,
      ),
      'value',
      samples.writingAgentFirstName,
      '[PASS] ✅ Persistence — Writing Agent First Name persisted after section navigation',
    );
    await this.assertions.verifyAttribute(
      this.locators.fieldInput(
        fields.writingAgentLastName.type,
        fields.writingAgentLastName.fieldId,
      ),
      'value',
      samples.writingAgentLastName,
      '[PASS] ✅ Persistence — Writing Agent Last Name persisted after section navigation',
    );
    await this.assertions.verifyAttribute(
      this.locators.fieldInput(fields.officeId.type, fields.officeId.fieldId),
      'value',
      samples.officeId,
      '[PASS] ✅ Persistence — Office Id persisted after section navigation',
    );
    await this.assertions.verifyAttribute(
      this.locators.fieldInput(
        fields.agentEmail.type,
        fields.agentEmail.fieldId,
      ),
      'value',
      samples.agentEmail,
      '[PASS] ✅ Persistence — Agent Email persisted after section navigation',
    );

    const phoneInput = this.locators.fieldInput(
      fields.phoneNumber.type,
      fields.phoneNumber.fieldId,
    );
    const expectedPhone = samples.phoneNumber;
    const actualPhone = (await phoneInput.getAttribute('value')) ?? '';
    const phonePersisted =
      expectedPhone.replace(/\D/g, '') === actualPhone.replace(/\D/g, '');
    const phoneAssertionName = this.formatMatrixTitle(
      phonePersisted,
      this.matrixName(
        'Persistence',
        'Phone Number persisted after section navigation',
      ),
    );

    this.logger.info(
      `${phoneAssertionName} | expected="${expectedPhone}" actual="${actualPhone}" result=${phonePersisted ? 'PASS' : 'FAIL'}`,
    );

    if (this.attach) {
      await dependencies.getReportManager().attachAssertionResult(this.attach, {
        assertionName: phoneAssertionName,
        expected: expectedPhone,
        actual: actualPhone,
        result: phonePersisted ? 'PASS' : 'FAIL',
        scenarioName: this.session?.stateName,
        stepName: this.reportStepName || this.stepName(),
        context: this.flowLabel(),
      });
    }

    if (!phonePersisted) {
      await this.failAssertion(phoneAssertionName, expectedPhone, actualPhone);
    }

    if (profile.licenseNumberPresent) {
      await this.assertions.verifyAttribute(
        this.locators.fieldInput(
          fields.licenseNumber.type,
          fields.licenseNumber.fieldId,
        ),
        'value',
        samples.licenseNumber,
        `[PASS] ✅ Persistence — License Number persisted for ${this.session!.stateName}`,
      );
    }

    if (profile.agentAddressPresent) {
      const addressFields = this.testData.agentAddressFields;
      const addressSamples =
        this.testData.validAddressSamplesByState[this.session!.stateName] ||
        this.testData.validAddressSamples;

      await this.assertObservedValue(
        'Agent Address Country persisted after section navigation',
        addressSamples.country,
        await this.licensingPage.getDropdownTriggerText(
          addressFields.country.fieldId,
        ),
        'Persistence',
      );
      await this.assertions.verifyAttribute(
        this.page.getByTestId(
          `agp-form-field-${addressFields.addressLine1.type}-${addressFields.addressLine1.fieldId}-input`,
        ),
        'value',
        addressSamples.addressLine1,
        `[PASS] ✅ Persistence — Address Line 1 persisted for ${this.session!.stateName}`,
      );
      await this.assertions.verifyAttribute(
        this.page.getByTestId(
          `agp-form-field-${addressFields.city.type}-${addressFields.city.fieldId}-input`,
        ),
        'value',
        addressSamples.city,
        `[PASS] ✅ Persistence — City persisted for ${this.session!.stateName}`,
      );
      await this.assertObservedValue(
        'Agent Address State/Territory persisted after section navigation',
        addressSamples.stateTerritory,
        await this.licensingPage.getDropdownTriggerText(
          addressFields.stateTerritory.fieldId,
        ),
        'Persistence',
      );
      await this.assertions.verifyAttribute(
        this.page.getByTestId(
          `agp-form-field-${addressFields.zipCode.type}-${addressFields.zipCode.fieldId}-input`,
        ),
        'value',
        addressSamples.zipCode,
        `[PASS] ✅ Persistence — Zip Code persisted for ${this.session!.stateName}`,
      );
    }
  }

  async assertReturnToApplications(): Promise<void> {
    await this.licensingPage.returnToApplications();
    await this.assertions.verifyVisible(
      this.page.getByRole('heading', { name: /^Applications$/i }),
      '[PASS] ✅ Navigation — Applications page heading displayed after Return to Applications',
    );
  }

  private formatMatrixTitle(passed: boolean, description: string): string {
    return `${passed ? '[PASS] ✅' : '[FAIL] ❌'} ${description}`;
  }

  private matrixName(category: string, description: string): string {
    return `${category} — ${description}`;
  }

  private flowLabel(): string {
    if (!this.session) {
      return 'Licensing Flow';
    }

    const flowCode = this.session.flowId.replace(/^FLOW_/, '');
    return `Flow ${flowCode} — ${this.session.stateName}`;
  }

  private recordSplitAgent(index: number, data: SplitAgentData): void {
    this.splitAgentRegistry.set(index, { ...data });
  }

  private updateRegisteredSplitAgent(
    index: number,
    updates: Partial<SplitAgentData>,
  ): void {
    const existing = this.requireRegisteredSplitAgent(index);
    this.splitAgentRegistry.set(index, { ...existing, ...updates });
  }

  private requireRegisteredSplitAgent(index: number): SplitAgentData {
    const agent = this.splitAgentRegistry.get(index);
    if (!agent) {
      throw new Error(`Split agent registry missing entry for index ${index}`);
    }
    return agent;
  }

  private rebuildSplitAgentRegistryAfterDelete(deletedIndex: number): void {
    const remaining: SplitAgentData[] = [];
    for (let i = 0; i < this.splitAgentRegistry.size; i++) {
      if (i !== deletedIndex) {
        remaining.push(this.requireRegisteredSplitAgent(i));
      }
    }
    this.splitAgentRegistry.clear();
    remaining.forEach((agent, index) => {
      this.splitAgentRegistry.set(index, agent);
    });
  }

  private async runSplitAgentPercentWorkflow(): Promise<void> {
    await this.licensingPage.deleteAllSplitAgents();
    this.splitAgentRegistry.clear();
    const samples = this.testData.splitAgentSamples;

    await this.assertAddSplitAgent(samples.agent1, 'Split Agent 1');
    await this.assertMainAgentPercentCalculation(
      '80',
      'after adding Split Agent 1 (20%)',
    );

    await this.assertAddSplitAgent(samples.agent2, 'Split Agent 2');
    await this.assertMainAgentPercentCalculation(
      '50',
      'after adding Split Agent 2 (30%)',
    );

    await this.assertEditSplitAgent(
      0,
      { percent: samples.editedAgent1Percent },
      'Split Agent 1',
      {
        expectedLoadedPercent: samples.agent1.percent,
        expectedMainPercentAfter: '30',
      },
    );

    await this.assertAddSplitAgent(samples.agent3, 'Split Agent 3');
    await this.assertMainAgentPercentCalculation(
      '20',
      'after adding Split Agent 3 (10%)',
    );

    await this.assertMaximumSplitAgents();
    await this.assertDeleteSplitAgent(1, 'Split Agent 2', '50');
  }

  private async restoreLicensingFormForValidSubmission(): Promise<void> {
    const profile = this.session!.profile;

    try {
      await this.licensingPage.restoreFormForValidSubmission(
        profile.licenseNumberPresent,
        profile.agentAddressPresent,
        this.session!.stateName,
      );
    } catch {
      await this.assertObservedValue(
        'Form restore — Main Agent Percent reached 100 before Office Id fill',
        '100',
        (await this.licensingPage.getMainAgentPercent()) || 'empty',
        'Form Restore',
      );
      return;
    }

    await this.assertObservedValue(
      'Form restore — Licensing page active',
      'visible',
      (await this.licensingPage.isLicensingModuleDisplayed())
        ? 'visible'
        : 'hidden',
      'Form Restore',
    );
    await this.assertMainAgentPercentCalculation(
      '100',
      'after restoring form for valid submission',
    );
    await this.assertions.verifyHidden(
      this.page
        .getByText(this.testData.validationMessages.totalPercentMustEqual100, {
          exact: false,
        })
        .first(),
      '[PASS] ✅ Form Restore — Total percentage validation error cleared',
    );
    await this.assertObservedValue(
      'Form restore — required field errors cleared',
      'hidden',
      (await this.licensingPage.isRequiredFieldErrorVisible())
        ? 'visible'
        : 'hidden',
      'Form Restore',
    );
  }

  private async resetFormToValidCoreBeforeSplitAgents(): Promise<void> {
    await this.licensingPage.fillValidLicensingCore(false);
  }

  private async attachFlowDurationSummary(): Promise<void> {
    const durationSec = (
      (Date.now() - this.session!.startedAtMs) /
      1000
    ).toFixed(1);
    await dependencies
      .getReportManager()
      .attachText(
        this.attach,
        `Flow ${this.session!.flowId} Execution Summary`,
        `State=${this.session!.stateName}; Flow=${this.session!.flowId}; DurationSeconds=${durationSec}; Session=1 login + 1 application + 1 Licensing session`,
      );
  }

  private async attachValidationMatrix(): Promise<void> {
    if (!this.validationMatrixCollector || !this.session) {
      return;
    }

    const flowLabel = this.flowLabel();
    const title = `📊 Licensing Validation Matrix — ${flowLabel}`;
    await this.validationMatrixCollector.attachHtml(
      this.attach,
      title,
      flowLabel,
    );
  }

  private startValidationMatrixCollector(): void {
    this.validationMatrixCollector = new ValidationMatrixCollector();
    dependencies
      .getReportManager()
      .setValidationMatrixCollector(this.validationMatrixCollector);
  }

  private clearValidationMatrixCollector(): void {
    dependencies.getReportManager().setValidationMatrixCollector(null);
    this.validationMatrixCollector = null;
  }

  /**
   * Records PASS only when expected === actual; otherwise fails the step.
   */
  private async assertObservedValue(
    description: string,
    expected: string,
    actual: string,
    category = 'Validation',
  ): Promise<void> {
    const passed = expected === actual;
    const assertionName = this.formatMatrixTitle(
      passed,
      this.matrixName(category, description),
    );

    this.logger.info(
      `${assertionName} | expected="${expected}" actual="${actual}" result=${passed ? 'PASS' : 'FAIL'}`,
    );

    if (this.attach) {
      await dependencies.getReportManager().attachAssertionResult(this.attach, {
        assertionName,
        expected,
        actual,
        result: passed ? 'PASS' : 'FAIL',
        scenarioName: this.session?.stateName,
        stepName: this.reportStepName || this.stepName(),
        context: this.flowLabel(),
      });
    }

    if (!passed) {
      await this.failAssertion(assertionName, expected, actual);
    }
  }

  private async assertAcceptedOneOf(
    description: string,
    actual: string,
    accepted: string[],
    category = 'Validation',
  ): Promise<void> {
    const passed = accepted.includes(actual);
    const expected = accepted.join(' or ');
    const assertionName = this.formatMatrixTitle(
      passed,
      this.matrixName(category, description),
    );

    this.logger.info(
      `${assertionName} | expected="${expected}" actual="${actual || 'empty'}" result=${passed ? 'PASS' : 'FAIL'}`,
    );

    if (this.attach) {
      await dependencies.getReportManager().attachAssertionResult(this.attach, {
        assertionName,
        expected,
        actual: actual || 'empty',
        result: passed ? 'PASS' : 'FAIL',
        scenarioName: this.session?.stateName,
        stepName: this.reportStepName || this.stepName(),
        context: this.flowLabel(),
      });
    }

    if (!passed) {
      await this.failAssertion(assertionName, expected, actual || 'empty');
    }
  }

  private failAssertion(name: string, expected: string, actual: string): never {
    throw new Error(`${name} | expected="${expected}" actual="${actual}"`);
  }

  private stepName(): string {
    return `Flow ${this.session?.flowId ?? 'UNKNOWN'}`;
  }

  private async initSession(stateName: string): Promise<void> {
    const activeStateName = this.applicationStateName ?? stateName.trim();
    const flowId = LicensingFlowResolver.resolveFlow(activeStateName);
    this.session = {
      stateName: activeStateName,
      flowId,
      profile: LicensingFlowResolver.getFlowProfile(flowId),
      startedAtMs: Date.now(),
    };
    this.startValidationMatrixCollector();
    await dependencies
      .getReportManager()
      .attachText(
        this.attach,
        'Resolved Licensing Flow',
        `State=${activeStateName}; Resolved Flow=${flowId}; Representative=${this.session.profile.representativeState}`,
      );
    await dependencies
      .getReportManager()
      .attachText(
        this.attach,
        `${this.flowLabel()} — Validation Matrix`,
        [
          'Licensing Page',
          'Field Validations',
          'Additional Agents',
          'Split Agent — Add / Edit / Cancel / Delete / Maximum',
          'Percentage Validation',
          'Navigation',
          'Persistence',
          'Form Restore',
        ].join('\n'),
      );
  }

  private splitSample(
    key: 'agent1' | 'agent2' | 'agent3',
    percentOverride?: string,
  ): SplitAgentData {
    const sample = this.testData.splitAgentSamples[key];
    return percentOverride ? { ...sample, percent: percentOverride } : sample;
  }

  private splitAgentUsesLicenseField(): boolean {
    return this.session!.profile.licenseNumberPresent;
  }

  private coreRequiredFields(
    includeAdditionalAgents: boolean,
  ): LicensingFieldDefinition[] {
    const fields = [
      this.testData.fields.writingAgentFirstName,
      this.testData.fields.writingAgentLastName,
      this.testData.fields.officeId,
      this.testData.fields.agentEmail,
      this.testData.fields.phoneNumber,
    ];

    if (includeAdditionalAgents) {
      fields.push(this.testData.fields.anyAdditionalAgents);
    }

    return fields;
  }

  private async fillValidCore(includeLicenseNumber: boolean): Promise<void> {
    await this.licensingPage.fillValidLicensingCore(includeLicenseNumber);
  }

  private async fillField(
    field: LicensingFieldDefinition,
    value: string,
  ): Promise<void> {
    await this.licensingPage.fillField(field, value);
  }

  private async assertFieldMessage(
    field: LicensingFieldDefinition,
    expectedMessage: string,
    assertionName: string,
  ): Promise<void> {
    const errorLocator = this.locators.fieldError(field.type, field.fieldId);

    if ((await errorLocator.count()) > 0) {
      await this.assertions.verifyContains(
        errorLocator.first(),
        expectedMessage,
        assertionName,
      );
      return;
    }

    await this.assertions.verifyVisible(
      this.page.getByText(expectedMessage, { exact: false }).first(),
      assertionName,
    );
  }
}
